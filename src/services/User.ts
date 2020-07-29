import { managed, ManagedRecord, ManagedService, service } from "typescene";
import { RemoteService } from "./Remote";

/** Fields for a user profile record */
export class Profile extends ManagedRecord {
    username!: string;
    bio?: string;
    image?: string;
    following?: boolean;
    email?: string;
    password?: string;
    token?: string;
}

/** Service that handles user authentication and profiles */
export class UserService extends ManagedService {
    name = "App.User";

    constructor() {
        super();

        // retrieve token from session storage and validate it (async)
        let token = sessionStorage.getItem("jwt");
        if (token) {
            this.isLoggedIn = true;
            setTimeout(() => {
                this._validateAsync(token!);
            }, 10);
        } else {
            // no token, resolve immediately
            this._loadedResolve();
        }
    }

    @service("App.Remote")
    remoteService!: RemoteService;

    /** True if the user is logged in (profile data may NOT be loaded yet) */
    isLoggedIn = false;

    /** Loaded profile data, if the user is logged in (loaded asynchronously) */
    @managed
    profile?: Profile;

    /** Sign out the current user and forget token */
    logout() {
        this.remoteService.token = undefined;
        sessionStorage.setItem("jwt", "");
        this.profile = undefined;
        this.isLoggedIn = false;
        this.emitChange();
    }

    /** Wait for current profile data to be loaded, if any */
    async loadAsync() {
        return this._loadedP;
    }

    /** Register a new user with given fields */
    async registerAsync(username: string, email: string, password: string) {
        this.remoteService.token = undefined;
        let result = await this.remoteService.postAsync("users", { user: { username, email, password } });
        this._setProfile(result.user);
    }

    /** Attempt to log in with given credentials */
    async loginAsync(email: string, password: string) {
        this.remoteService.token = undefined;
        let result = await this.remoteService.postAsync("users/login", { user: { email, password } });
        this._setProfile(result.user);
    }

    /** Update profile data for the current user */
    async saveProfileAsync(user: Profile & { password?: string }) {
        if (!user.image) user.image = null as any;
        let result = await this.remoteService.putAsync("user", { user });
        this._setProfile(result.user);
    }

    /** Returns the user profile for given user */
    async getProfileAsync(username: string): Promise<Profile> {
        username = encodeURIComponent(username);
        let result = await this.remoteService.getAsync("profiles/" + username);
        let profile: Partial<Profile> = result.profile;
        if (!profile || !profile.username) {
            throw Error("Invalid user profile");
        }
        return Profile.create(profile);
    }

    /** Start following given user; emits a change event if successful */
    async followUserAsync(username: string) {
        username = encodeURIComponent(username);
        await this.remoteService.postAsync("profiles/" + username + "/follow", {});
        this.emitChange();
    }

    /** Stop following given user; emits a change event if successful */
    async unfollowUserAsync(username: string) {
        username = encodeURIComponent(username);
        await this.remoteService.deleteAsync("profiles/" + username + "/follow");
        this.emitChange();
    }

    private async _validateAsync(token: string) {
        try {
            this.remoteService.token = token;
            let result = await this.remoteService.getAsync("user");
            if (!result.user) throw Error("Invalid response");
            if (!result.user.token) result.user.token = token;
            this._setProfile(result.user);
        } catch {
            this.logout();
        }
        this._loadedResolve();
    }

    private _setProfile(profile: Partial<Profile>) {
        if (!profile || !profile.username) {
            throw Error("Invalid user profile");
        }
        if (profile.token) {
            this.remoteService.token = profile.token;
            sessionStorage.setItem("jwt", profile.token);
        }
        this.profile = Profile.create(profile);
        this.isLoggedIn = true;
        this.emitChange();
    }

    private _loadedP = new Promise(r => {
        this._loadedResolve = r;
    });
    private _loadedResolve!: () => void;
}
