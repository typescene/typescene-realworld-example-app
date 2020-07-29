import { managedChild, PageViewActivity, service } from "typescene";
import { FEED_LIMIT } from "../../app";
import { ArticleFeed, ArticlesService } from "../../services/Articles";
import { Profile, UserService } from "../../services/User";
import view from "./view";

/** Profile page activity (singleton) */
export class ProfileActivity extends PageViewActivity.with(view) {
    path = "/profile/:username";
    name = "User profile";

    @service("App.User")
    userService!: UserService;

    @service("App.Articles")
    articlesService!: ArticlesService;

    /** The current profile record */
    @managedChild
    profile?: Profile;

    /** 'Own' articles feed, loaded and displayed asynchronously */
    @managedChild
    articlesFeed?: ArticleFeed;

    /** 'Faved' articles feed, loaded and displayed asynchronously */
    @managedChild
    favesFeed?: ArticleFeed;

    /** Current username, unencoded */
    username = "";

    /** True if this is the user's own profile (to show logout/settings buttons) */
    isOwnProfile = false;

    /** Selected tab ID */
    visibleFeed: "articles" | "faves" = "articles";

    async onManagedStateInactiveAsync() {
        await super.onManagedStateInactiveAsync();
        this.articlesFeed = undefined;
        this.favesFeed = undefined;
    }

    /** (Re)load profile data for current user */
    async loadAsync() {
        await this.userService.loadAsync();
        this.profile = await this.userService.getProfileAsync(this.username);
        this.isOwnProfile = !!this.userService.profile && this.profile.username === this.userService.profile.username;

        // load both feeds asynchronously
        this.articlesFeed = await this.articlesService.getArticleFeed({
            author: this.username,
            limit: FEED_LIMIT,
        });
        this.favesFeed = await this.articlesService.getArticleFeed({
            favorited: this.username,
            limit: FEED_LIMIT,
        });
    }

    /** Event handler: toggle user follow status */
    async toggleFollowProfile() {
        if (!this.profile) return;
        try {
            this.profile.following = !this.profile.following;
            this.profile.emitChange();
            if (this.profile.following) {
                await this.userService.followUserAsync(this.username);
            } else {
                await this.userService.unfollowUserAsync(this.username);
            }
        } catch (err) {
            // TODO: show warning
        }
    }

    /** Event handler: show 'own' articles tab */
    showArticles() {
        this.visibleFeed = "articles";
    }

    /** Event handler: show 'faved' articles tab */
    showFaves() {
        this.visibleFeed = "faves";
    }

    /** Event handler: log out and navigate away */
    doLogout() {
        this.userService.logout();
        this.getApplication()!.navigate("/");
    }
}

ProfileActivity.addObserver(
    class {
        constructor(public readonly activity: ProfileActivity) {}

        async onMatchChangeAsync() {
            this.activity.profile = undefined;
            this.activity.visibleFeed = "articles";
            this.activity.articlesFeed = undefined;
            this.activity.favesFeed = undefined;
            if (this.activity.match) {
                // decode username and load user service and activity now
                let username = decodeURIComponent(this.activity.match.username);
                this.activity.name = this.activity.username = username;
                try {
                    await this.activity.loadAsync();
                } catch (err) {
                    this.activity.showConfirmationDialogAsync(err.message);
                }
            }
        }
    }
);
