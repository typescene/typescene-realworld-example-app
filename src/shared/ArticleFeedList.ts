import {
  Application,
  bind,
  managed,
  ManagedList,
  service,
  UICenterRow,
  UIFlowCell,
  UILinkButton,
  UIListController,
  UIRow,
  UISpacer,
  ViewComponent,
  UILabel,
  ActionEvent,
} from "typescene";
import { FEED_LIMIT } from "../app";
import { Article, ArticleFeed, ArticlesService } from "../services/Articles";
import ArticlePreview from "./ArticlePreview";

/** View component that displays a paginated article feed */
export class ArticleFeedList extends ViewComponent.with({
  view: UIFlowCell.with(
    // messages:
    UIFlowCell.with(
      { hidden: bind("!feed.loading"), padding: 16 },
      UIRow.with(UILabel.withText("Loading..."))
    ),
    UIFlowCell.with(
      { hidden: bind("!feed.error"), padding: 16 },
      UIRow.with(UILabel.withText("An error occurred."))
    ),
    UIFlowCell.with(
      { hidden: bind("!empty"), padding: 16 },
      UIRow.with(UILabel.withText("No articles here... yet."))
    ),

    // actual list of article previews:
    UIListController.with(
      { items: bind("visibleArticles") },
      ArticlePreview,
      UIFlowCell.with({
        separator: { type: "line" },
        asyncContentRendering: true,
      }),
      UISpacer
    ),

    // pagination links:
    UICenterRow.with(
      UILinkButton.with({
        hidden: bind("isAtStart"),
        disabled: bind("moving"),
        label: "<< Newest",
        onClick: "+MoveToNewest",
      }),
      UILinkButton.with({
        hidden: bind("isAtStart"),
        disabled: bind("moving"),
        label: "< Newer",
        onClick: "+MoveToNewer",
      }),
      UILinkButton.with({
        hidden: bind("!hasNext"),
        disabled: bind("moving"),
        label: "Older >",
        onClick: "+MoveToOlder",
      })
    )
  ),
  defaults: {
    feed: undefined as ArticleFeed | undefined,
  },
}) {
  /** Article feed (preset only once) */
  @managed
  readonly feed?: ArticleFeed;

  @service("App.Articles")
  articlesService!: ArticlesService;

  /** List of visible articles (NOT child components, since the articles belong to the feed itself) */
  visibleArticles = new ManagedList<Article>();

  /** True if the list is empty */
  empty?: boolean;

  /** True if the user clicked pagination buttons */
  moving?: boolean;

  /** True if there are no newer articles in the feed */
  isAtStart = true;

  /** True if there are older articles in the feed */
  hasNext = false;

  /** Event handler, moves the feed all the way forward */
  async onMoveToNewest() {
    try {
      this.moving = true;
      await this.feed!.updateAsync(0);
    } finally {
      this.moving = false;
    }
  }

  /** Event handler, moves the feed forward */
  async onMoveToNewer() {
    try {
      this.moving = true;
      await this.feed!.updateAsync(this.feed!.offset - FEED_LIMIT);
    } finally {
      this.moving = false;
    }
  }

  /** Event handler, moves the feed backward */
  async onMoveToOlder() {
    try {
      this.moving = true;
      await this.feed!.updateAsync(this.feed!.offset + FEED_LIMIT);
    } finally {
      this.moving = false;
    }
  }

  /* Event handler, toggles article favorite */
  onToggleArticleFav(e: ActionEvent<any, Article>) {
    if (e.context) {
      let article = e.context;

      // update client side favorite status first
      article.favorited = !article.favorited;
      article.favoritesCount =
        (article.favoritesCount || 0) + (article.favorited ? 1 : -1);
      article.emitChange();

      // call the appropriate API
      if (article.favorited) {
        this.articlesService.favoriteArticleAsync(article.slug!).catch(err => {
          console.log(err);
        });
      } else {
        this.articlesService
          .unfavoriteArticleAsync(article.slug!)
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
}

ArticleFeedList.addObserver(
  class {
    constructor(public readonly list: ArticleFeedList) {}

    // observe the actual feed for changes (movement)
    async onFeedChangeAsync() {
      if (!this.list.visibleArticles) return;
      this.list.visibleArticles.clear();
      this.list.empty = undefined;
      let feed = this.list.feed;
      if (feed && !feed.loading) {
        this.list.empty = !feed.totalCount;
        this.list.hasNext = feed.offset + FEED_LIMIT < feed.totalCount!;
        this.list.isAtStart = !feed.offset;

        // this is a trick to make the screen update faster
        // by delaying the rendering of most articles
        this.list.visibleArticles.add(...feed.list.take(3));
        await new Promise(r => setTimeout(r, 20));
        this.list.visibleArticles.replace(feed.list);
      }
    }
  }
);
