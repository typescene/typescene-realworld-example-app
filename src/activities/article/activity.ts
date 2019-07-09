import * as marked from "marked";
import { CHANGE, managedChild, ManagedList, ManagedRecord, PageViewActivity, service, UIComponentEvent, UIListCellAdapterEvent, UITextField, ViewActivity } from "typescene";
import { Article, ArticlesService, Comment, CommentList } from "../../services/Articles";
import { TagList } from "../../services/Tags";
import { UserService } from "../../services/User";
import view from "./view";
import ArticleView from "./view/ArticleView";
import { CommentCard } from "./view/CommentCard";

/** 'Inner' activity, displays article itself */
export class ArticleInnerActivity extends ViewActivity.with(ArticleView) {
    constructor(article: ManagedRecord & Article) {
        super();
        this.article = article;
    }

    @service("App.User")
    userService!: UserService;

    @service("App.Articles")
    articlesService!: ArticlesService;

    /** The article itself */
    @managedChild
    readonly article: ManagedRecord & Article;

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
        this.tags = new ManagedList(...(this.article.tagList || [])
            .map(tag => ManagedRecord.create({ tag })));

        this.loaded = true;
        this.emit(CHANGE);

        // load comments asynchronously
        (async () => {
            this.comments = await this.articlesService.getCommentsAsync(this.article.slug!);
        })().catch(err => {
            console.log(err);
        })
    }

    /** Event handler, navigates to the author's profile */
    goToProfile() {
        this.getApplication()!.navigate("/profile/" + this.article.author!.username);
    }

    /** Event handler, navigates to the editor for this article */
    editArticle() {
        this.getApplication()!.navigate("/editor/" + this.article.slug);
    }

    /** Event handler, deletes the article after confirmation by the user */
    async deleteArticle() {
        let confirm = await this.showConfirmationDialogAsync(
            "Are you sure you want to delete this article?\n" +
            "This action cannot be undone.",
            "", "Yes, delete", "Cancel");
        if (confirm) {
            this.comments = undefined;
            this.tags = undefined;
            this.bodyHtml = "Please wait...";
            try {
                await this.articlesService.deleteArticleAsync(this.article.slug!);
            }
            catch (err) {
                this.showConfirmationDialogAsync(err.message);
            }

            // navigate away from the deleted/errored article
            this.getApplication()!.navigate("/");
        }
    }

    /** Event handler: toggle author follow status */
    async toggleFollowProfile() {
        let author = this.article.author!;
        try {
            // update client side first
            author.following = !author.following;
            this.article.emit(CHANGE);

            // call the appropriate API
            if (author.following) {
                await this.userService.followUserAsync(author.username);
            }
            else {
                await this.userService.unfollowUserAsync(author.username);
            }
        }
        catch (err) {
            // TODO: show warning
        }
    }

    /** Event handler: toggle article favorite status */
    toggleArticleFav() {
        // update client side first
        this.article.favorited = !this.article.favorited;
        this.article.favoritesCount = (this.article.favoritesCount || 0) +
            (this.article.favorited ? 1 : -1);
        this.article.emit(CHANGE);

        // call the appropriate API
        if (this.article.favorited) {
            this.articlesService.favoriteArticleAsync(this.article.slug!).catch(err => {
                this.showConfirmationDialogAsync(err.message);
            });
        }
        else {
            this.articlesService.unfavoriteArticleAsync(this.article.slug!).catch(err => {
                this.showConfirmationDialogAsync(err.message);
            });
        }
    }

    /** Event handler: update bound draft comment text */
    updateCommentDraft(e: UIComponentEvent<UITextField>) {
        this.commentDraft = e.source.value;
    }

    /** Event handler: publish draft comment */
    async postComment() {
        let body = this.commentDraft;
        if (!body || !this.comments) return;
        this.commentDraft = undefined;
        let comment = await this.articlesService.addCommmentAsync(this.article.slug!, { body });
        this.comments.add(comment);
    }

    /** Event handler: delete a comment */
    async deleteComment(e: UIListCellAdapterEvent<ManagedRecord & Comment>) {
        if (!e.object || !e.object.id) return;
        try {
            let card = e.source.getParentComponent(CommentCard);
            if (card) card.deleting = true;
            await this.articlesService.deleteCommentAsync(this.article.slug!, e.object.id);
            this.comments && this.comments.remove(e.object);
        }
        catch (err) {
            console.log(err)
            this.showConfirmationDialogAsync(err.message);
        }
    }
}

/** 'Outer' article activity (singleton), displays a placeholder ONLY */
export class ArticleActivity extends PageViewActivity.with(view) {
    path = "/article/*slug";

    @service("App.Articles")
    articlesService!: ArticlesService;

    /** Inner activity reference */
    @managedChild
    activity?: ArticleInnerActivity;

    /** True if the article could not be loaded */
    error?: boolean;

    async onManagedStateInactiveAsync() {
        await super.onManagedStateInactiveAsync();

        // destroy the inner activity when navigating away
        this.activity = undefined;
    }

    async loadArticleAsync(slug: string) {
        try {
            let article = await this.articlesService.getArticleAsync(slug);
            this.activity = new ArticleInnerActivity(article);
            await this.activity.activateAsync();
            this.error = false;
        }
        catch (err) {
            console.log(err);
            this.error = true;
        }
    }
}

ArticleActivity.observe(class {
    constructor (public readonly activity: ArticleActivity) { }
    async onMatchChangeAsync() {
        if (!this.activity.match) return;

        // find the current slug and load the actual article
        let slug = this.activity.match.slug;
        if (slug) this.activity.loadArticleAsync(slug);
    }
})
