import {
  AppActivationContext,
  component,
  PageViewActivity,
  service,
} from "typescene";
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
  @component
  profile?: Profile;

  /** 'Own' articles feed, loaded and displayed asynchronously */
  @component
  articlesFeed?: ArticleFeed;

  /** 'Faved' articles feed, loaded and displayed asynchronously */
  @component
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

  /** Check matched path */
  async activateAsync(match?: AppActivationContext.MatchedPath) {
    await super.activateAsync(match);

    // reset all content first
    this.profile = undefined;
    this.visibleFeed = "articles";
    this.articlesFeed = undefined;
    this.favesFeed = undefined;

    // decode username and load user service and activity now
    if (match) {
      let username = decodeURIComponent(match.username);
      this.name = this.username = username;
      try {
        await this.loadAsync();
      } catch (err) {
        this.showConfirmationDialogAsync(err.message);
      }
    }
  }

  /** (Re)load profile data for current user */
  async loadAsync() {
    await this.userService.loadAsync();
    this.profile = await this.userService.getProfileAsync(this.username);
    this.isOwnProfile =
      !!this.userService.profile &&
      this.profile.username === this.userService.profile.username;

    // load both feeds asynchronously
    this.articlesFeed = this.articlesService.getArticleFeed({
      author: this.username,
      limit: FEED_LIMIT,
    });
    this.favesFeed = this.articlesService.getArticleFeed({
      favorited: this.username,
      limit: FEED_LIMIT,
    });
  }

  /** Event handler: toggle user follow status */
  async onToggleFollowProfile() {
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
  onShowArticles() {
    this.visibleFeed = "articles";
  }

  /** Event handler: show 'faved' articles tab */
  onShowFaves() {
    this.visibleFeed = "faves";
  }

  /** Event handler: log out and navigate away */
  onLogout() {
    this.userService.logout();
    this.getApplication()!.navigate("/");
  }
}

ProfileActivity.autoUpdate(module);
