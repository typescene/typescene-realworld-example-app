import * as marked from "marked";
import {
  managedChild,
  ManagedList,
  PageViewActivity,
  service,
  UITextField,
  ViewActivity,
  ManagedRecord,
  component,
  ActionEvent,
  AppActivationContext,
} from "typescene";
import {
  Article,
  ArticlesService,
  Comment,
  CommentList,
} from "../../services/Articles";
import { TagList } from "../../services/Tags";
import { UserService } from "../../services/User";
import ArticleView from "./view/ArticleView";
import { CommentCard } from "./view/CommentCard";
import view from "./view";

/** 'Inner' activity, displays article itself */
export class ArticleInnerActivity extends ViewActivity.with(ArticleView) {
  constructor(article: Article) {
    super();
    this.article = article;
  }

  @service("App.User")
  userService!: UserService;

  @service("App.Articles")
  articlesService!: ArticlesService;

  /** The article itself */
  @component
  readonly article: Article;

  /** List of comments, loaded asynchronously */
  @managedChild
  comments?: CommentList;

  /** List of tags as Tag records */
  @managedChild
  tags?: TagList;

  /** Parsed Markdown (HTML) */
  bodyHtml?: string;

  /** Draft text bound to the comment text field */
  commentDraft?: string;

  /** True if the article and user profile have been loaded/parsed fully */
  loaded = false;

  /** True if the article is written by the user themselves */
  isOwnProfile?: boolean;

  async onManagedStateActivatingAsync() {
    await super.onManagedStateActivatingAsync();

    // wait for user service, and check profile data
    await this.userService.loadAsync();
    if (this.userService.profile) {
      this.isOwnProfile =
        this.userService.profile.username === this.article.author!.username;
    }

    // parse article and populate tags
    this.bodyHtml = marked.parse(this.article.body);
    this.tags = new ManagedList(
      ...(this.article.tagList || []).map(tag => ManagedRecord.create({ tag }))
    );

    this.loaded = true;
    this.emitChange();

    // load comments asynchronously
    (async () => {
      this.comments = await this.articlesService.getCommentsAsync(
        this.article.slug!
      );
    })().catch(err => {
      console.log(err);
    });
  }

  /** Event handler, navigates to the author's profile */
  onGoToProfile() {
    this.getApplication()!.navigate(
      "/profile/" + this.article.author!.username
    );
  }

  /** Event handler, navigates to the editor for this article */
  onEditArticle() {
    this.getApplication()!.navigate("/editor/" + this.article.slug);
  }

  /** Event handler, deletes the article after confirmation by the user */
  async onDeleteArticle() {
    let confirm = await this.showConfirmationDialogAsync(
      "Are you sure you want to delete this article?\n" +
        "This action cannot be undone.",
      "",
      "Yes, delete",
      "Cancel"
    );
    if (confirm) {
      this.comments = undefined;
      this.tags = undefined;
      this.bodyHtml = "Please wait...";
      try {
        await this.articlesService.deleteArticleAsync(this.article.slug!);
      } catch (err) {
        this.showConfirmationDialogAsync(err.message);
      }

      // navigate away from the deleted/errored article
      this.getApplication()!.navigate("/");
    }
  }

  /** Event handler: toggle author follow status */
  async onToggleFollowProfile() {
    let author = this.article.author!;
    try {
      // update client side first
      author.following = !author.following;
      this.article.emitChange();

      // call the appropriate API
      if (author.following) {
        await this.userService.followUserAsync(author.username);
      } else {
        await this.userService.unfollowUserAsync(author.username);
      }
    } catch (err) {
      // TODO: show warning
    }
  }

  /** Event handler: toggle article favorite status */
  onToggleArticleFav() {
    // update client side first
    this.article.favorited = !this.article.favorited;
    this.article.favoritesCount =
      (this.article.favoritesCount || 0) + (this.article.favorited ? 1 : -1);
    this.article.emitChange();

    // call the appropriate API
    if (this.article.favorited) {
      this.articlesService
        .favoriteArticleAsync(this.article.slug!)
        .catch(err => {
          this.showConfirmationDialogAsync(err.message);
        });
    } else {
      this.articlesService
        .unfavoriteArticleAsync(this.article.slug!)
        .catch(err => {
          this.showConfirmationDialogAsync(err.message);
        });
    }
  }

  /** Event handler: update bound draft comment text */
  onUpdateCommentDraft(e: ActionEvent<UITextField>) {
    this.commentDraft = e.source.value;
  }

  /** Event handler: publish draft comment */
  async onPostComment() {
    let body = this.commentDraft;
    if (!body || !this.comments) return;
    this.commentDraft = undefined;
    let comment = await this.articlesService.addCommmentAsync(
      this.article.slug!,
      { body }
    );
    this.comments.add(comment);
  }

  /** Event handler: delete a comment */
  async onDeleteComment(e: ActionEvent<any, Comment>) {
    if (!e.context || !e.context.id) return;
    try {
      let card = e.source.getParentComponent(CommentCard);
      if (card) card.deleting = true;
      await this.articlesService.deleteCommentAsync(
        this.article.slug!,
        e.context.id
      );
      this.comments && this.comments.remove(e.context);
    } catch (err) {
      console.log(err);
      this.showConfirmationDialogAsync(err.message);
    }
  }
}

ArticleInnerActivity.autoUpdate(module);

/** 'Outer' article activity (singleton), displays a placeholder ONLY */
export class ArticleActivity extends PageViewActivity.with(view) {
  path = "/article/*slug";

  @service("App.Articles")
  articlesService!: ArticlesService;

  /** Inner activity reference */
  @component(ArticleInnerActivity)
  activity?: ArticleInnerActivity;

  /** True if the article could not be loaded */
  error?: boolean;

  async onManagedStateInactiveAsync() {
    await super.onManagedStateInactiveAsync();

    // destroy the inner activity when navigating away
    this.activity = undefined;
  }

  /** Check matched path */
  async activateAsync(match?: AppActivationContext.MatchedPath) {
    await super.activateAsync(match);

    // find the current slug and load the actual article
    let slug = match?.slug;
    if (slug) {
      try {
        let article = await this.articlesService.getArticleAsync(slug);
        this.activity = new ArticleInnerActivity(article);
        await this.activity.activateAsync();
        this.error = false;
      } catch (err) {
        console.log(err);
        this.error = true;
      }
    }
  }
}
