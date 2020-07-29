import { managedChild, ManagedList, ManagedRecord, ManagedService, service } from "typescene";
import { RemoteService } from "./Remote";
import { Profile } from "./User";

/** All fields for an article object */
export class Article extends ManagedRecord {
    constructor(public slug = "", public title = "", public description = "", public body = "") {
        super();
    }
    tagList?: string[];
    createdAt?: string;
    updatedAt?: string;
    favorited?: boolean;
    favoritesCount?: number;
    author?: Profile;
}

/** All fields for a comment object */
export class Comment extends ManagedRecord {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    body?: string;
    author?: Profile;
}

/** All fields to be specified to query articles from the server */
export interface ArticleQuery {
    limit?: number;
    offset?: number;
    tag?: string;
    author?: string;
    favorited?: string;
}

/** Managed list of comments */
export type CommentList = ManagedList<Comment>;

/** Represents an article feed that can be updated at another offset */
export class ArticleFeed extends ManagedRecord {
    constructor(public readonly query: ArticleQuery, public readonly isPersonalFeed?: boolean) {
        super();
    }

    @service("App.Remote")
    remote!: RemoteService;

    /** Reload the feed from given offset */
    async updateAsync(offset = 0) {
        this.query.offset = Math.max(0, offset);
        try {
            this.loading = true;
            let params = "";
            let q = this.query;
            for (let key in q) {
                params += "&" + key + "=" + encodeURIComponent((q as any)[key]);
            }
            let path = this.isPersonalFeed ? "articles/feed" : "articles";
            let result = await this.remote!.getAsync(path + "?" + params.slice(1));
            let articles: Article[] = result.articles;
            if (!Array.isArray(articles)) {
                throw Error("Invalid article listing");
            }

            // check if not destroyed while loading
            if (this.managedState) {
                this.totalCount = result.articlesCount || 0;
                this.list.replace(articles.map(a => Article.create(a)));
                this.offset = offset || 0;
                this.error = false;
                this.emitChange();
            }
        } catch (err) {
            console.log(err);
            this.error = true;
            this.emitChange();
        }
        this.loading = false;
    }

    /** The actual list of articles */
    @managedChild
    list = new ManagedList<Article>();

    /** True if the list is currently loading */
    loading?: boolean;

    /** True if an error occurred while loading */
    error?: boolean;

    /** Total number of articles, could be more than the current list */
    totalCount?: number;

    /** Current article offset, starts at 0 */
    offset = 0;
}

/** Service that handles articles and comments */
export class ArticlesService extends ManagedService {
    name = "App.Articles";

    @service("App.Remote")
    remote?: RemoteService;

    /** Returns an article feed for given query */
    getArticleFeed(q: ArticleQuery = {}, isPersonalFeed?: boolean) {
        let result = new ArticleFeed(q, isPersonalFeed);
        result.updateAsync();
        return result;
    }

    /** Returns the article for given slug */
    async getArticleAsync(slug: string) {
        let result = await this.remote!.getAsync("articles/" + slug);
        let article: Partial<Article> = result.article;
        if (!article || !article.slug) {
            throw Error("Invalid article");
        }
        return Article.create(article);
    }

    /** Saves (create/update) given article data, returns the resulting record */
    async saveArticleAsync(article: Article) {
        let result = article.slug
            ? await this.remote!.putAsync("articles/" + article.slug, { article })
            : await this.remote!.postAsync("articles", { article });
        let created: Partial<Article> = result.article;
        if (!created || !created.slug) {
            throw Error("Invalid article");
        }
        return Article.create(created);
    }

    /** Deletes the article with given slug */
    async deleteArticleAsync(slug: string) {
        await this.remote!.deleteAsync("articles/" + slug);
    }

    /** Marks the article with given slug as a favorite for the current user */
    async favoriteArticleAsync(slug: string) {
        await this.remote!.postAsync("articles/" + slug + "/favorite", {});
    }

    /** Unmarks the article with given slug as a favorite for the current user */
    async unfavoriteArticleAsync(slug: string) {
        await this.remote!.deleteAsync("articles/" + slug + "/favorite");
    }

    /** Returns a managed list of Comment records */
    async getCommentsAsync(slug: string): Promise<CommentList> {
        let result = await this.remote!.getAsync("articles/" + slug + "/comments");
        let comments: Array<Partial<Comment>> = result.comments;
        if (!Array.isArray(comments)) {
            throw Error("Invalid comments listing");
        }
        return new ManagedList(...comments.map(c => Comment.create(c)));
    }

    /** Saves (creates) given comment for the article with given slug */
    async addCommmentAsync(slug: string, comment: Partial<Comment>) {
        let result = await this.remote!.postAsync("articles/" + slug + "/comments", { comment });
        let created: Partial<Comment> = result.comment;
        if (!created || !created.id) {
            throw Error("Invalid comment");
        }
        return Comment.create(created);
    }

    /** Deletes given comment from the article with given slug */
    async deleteCommentAsync(slug: string, id: string) {
        await this.remote!.deleteAsync("articles/" + slug + "/comments/" + id);
    }
}
