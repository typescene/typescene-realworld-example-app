import { managedChild, PageViewActivity, service, UIListCellAdapterEvent, ManagedRecord } from "typescene";
import { FEED_LIMIT } from "../../app";
import { ArticleFeed, ArticlesService } from "../../services/Articles";
import { Tag, TagList, TagsService } from "../../services/Tags";
import { UserService } from "../../services/User";
import view from "./view";

/** Home page activity */
export class HomeActivity extends PageViewActivity.with(view) {
    path = "";
    name = "Conduit";

    @service("App.User")
    userService!: UserService;

    @service("App.Articles")
    articlesService!: ArticlesService;

    @service("App.Tags")
    tagsService!: TagsService;

    /** The current global feed, loaded asynchronously */
    @managedChild
    globalFeed?: ArticleFeed;

    /** The current profile feed, loaded asynchronously */
    @managedChild
    profileFeed?: ArticleFeed;

    /** The current tag feed, if any, loaded asynchronously */
    @managedChild
    tagFeed?: ArticleFeed;

    /** Currently selected tab ID */
    visibleFeed: "global" | "feed" | "tag" = "global";

    /** Currently selected tag, if any */
    selectedTag?: string;

    /** List of 'popular' tags */
    allTags?: TagList;

    /** True if the list of tags is currently loading */
    loading = true;

    async onManagedStateActivatingAsync() {
        await super.onManagedStateActivatingAsync();
        if (this.loading) {
            // wait for user service and load feeds
            await this.userService.loadAsync();
            this.globalFeed = this.articlesService.getArticleFeed({ limit: FEED_LIMIT });
            this.loadProfileFeedAsync();

            // load tags a little later:
            (async () => {
                try {
                    this.allTags = await this.tagsService.getTagsAsync();
                } catch (err) {
                    console.log(err);
                }
                this.loading = false;
            })();
        }
    }

    /** Load the profile feed for the current user (also when changed) */
    async loadProfileFeedAsync() {
        if (this.userService.profile) {
            // might have logged in or subscribed here
            try {
                this.profileFeed = this.articlesService.getArticleFeed({ limit: FEED_LIMIT }, true);
            } catch {}
        } else if (this.visibleFeed === "feed") {
            // this may happen right after logging out
            this.showGlobalFeed();
        }
    }

    /** Event handler: show the global feed 'tab' */
    showGlobalFeed() {
        if (this.visibleFeed !== "global") {
            this.visibleFeed = "global";
            if (this.globalFeed && this.globalFeed.offset > 0) {
                this.globalFeed.updateAsync(0);
            }
        }
    }

    /** Event handler: show the profile feed 'tab' */
    showProfileFeed() {
        if (this.visibleFeed !== "feed") {
            this.visibleFeed = "feed";
            if (this.profileFeed && this.profileFeed.offset > 0) {
                this.profileFeed.updateAsync(0);
            }
        }
    }

    /** Event handler: show the tag feed 'tab', if possible */
    showTagFeed() {
        this.visibleFeed = "tag";
        if (this.tagFeed && this.tagFeed.offset > 0) {
            this.tagFeed.updateAsync(0);
        }
    }

    /** Event handler: select a tag for which to display articles */
    selectTag(e: UIListCellAdapterEvent<ManagedRecord & Tag>) {
        if (e.object && e.object.tag) {
            // update state and load feed asynchronously
            this.selectedTag = e.object.tag;
            this.tagFeed = this.articlesService.getArticleFeed({
                tag: e.object.tag,
                limit: FEED_LIMIT,
            });
            this.showTagFeed();
        }
    }
}

HomeActivity.addObserver(
    class {
        constructor(public readonly activity: HomeActivity) {}
        onUserServiceChangeAsync() {
            this.activity.loadProfileFeedAsync();
        }
    }
);
