import { managedChild, ManagedRecord, PageViewActivity, service } from "typescene";
import { Article, ArticlesService } from "../../services/Articles";
import view from "./view";

/** Article editor activity */
export class EditorActivity extends PageViewActivity.with(view) {
    path = "/editor/";
    name = "New Article";

    @service("App.Articles")
    articlesService!: ArticlesService;

    /** Draft article record */
    @managedChild
    article?: ManagedRecord & Article & { tagsString?: string };

    /** True if the article is currently loading */
    loading = false;

    /** Reset all input fields */
    clearForm() {
        this.article = ManagedRecord.create({
            title: "",
            description: "",
            body: "",
            tagsString: ""
        });
    }

    /** Load the article with given slug, asynchronously */
    async loadAsync(slug: string) {
        this.loading = true;
        this.clearForm();
        this.article!.title = "Loading..."
        try {
            this.article = await this.articlesService.getArticleAsync(slug);
        }
        catch (err) {
            this.showConfirmationDialogAsync(err.message);
            this.article!.title = "";
        }
        finally {
            this.loading = false;
        }
    }

    /** Submit (create/update) the current article */
    async submit() {
        if (!this.article) return;
        this.loading = true;
        try {
            // split tags on spaces/punctuation
            this.article.tagList = (this.article.tagsString || "")
                .split(/[\s,;]+/)
                .filter(s => !!s);

            // save the article and navigate to the article page
            let result = await this.articlesService.saveArticleAsync(this.article);
            this.getApplication()!.navigate("/article/" + result.slug);
        }
        catch (err) {
            this.showConfirmationDialogAsync(err.message);
        }
        this.loading = false;
    }
}

EditorActivity.observe(class {
    constructor (public readonly activity: EditorActivity) { }
    onMatchChangeAsync() {
        if (!this.activity.match) return;

        // figure out if the user wants to edit an article or start new:
        let slug = this.activity.match.path.replace(/^\/?editor\/?/, "");
        if (slug) this.activity.loadAsync(slug);
        else this.activity.clearForm();
    }
})
