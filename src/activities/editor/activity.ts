import { managedChild, PageViewActivity, service, UIFormContext } from "typescene";
import { Article, ArticlesService } from "../../services/Articles";
import view from "./view";

/** Article editor activity */
export class EditorActivity extends PageViewActivity.with(view) {
    path = "/editor/";
    name = "New Article";

    @service("App.Articles")
    articlesService!: ArticlesService;

    /** Draft article fields */
    @managedChild
    formContext?: UIFormContext<Partial<Article> & { tagsString: string }>;

    /** True if the article is currently loading */
    loading = false;

    /** Reset all input fields */
    clearForm() {
        this.formContext = UIFormContext.create({
            title: "",
            description: "",
            body: "",
            tagsString: "",
        }).required("title");
    }

    /** Load the article with given slug, asynchronously */
    async loadAsync(slug: string) {
        this.loading = true;
        this.clearForm();
        this.formContext!.set("title", "Loading...");
        try {
            let article = await this.articlesService.getArticleAsync(slug);
            this.formContext = UIFormContext.create({
                ...article,
                tagsString: article.tagList?.join(", "),
            }).required("title");
        } catch (err) {
            this.showConfirmationDialogAsync(err.message);
            this.formContext!.set("title", "");
        } finally {
            this.loading = false;
        }
    }

    /** Submit (create/update) the current article */
    async submit() {
        if (!this.formContext) return;
        console.info(this.formContext);
        this.formContext.validateAll();
        if (!this.formContext.valid) return;
        this.loading = true;
        try {
            // create article data
            let article = Article.create(this.formContext.serialize());

            // split tags on spaces/punctuation
            let tagsString = this.formContext.get("tagsString") || "";
            article.tagList = tagsString.split(/[\s,;]+/).filter(s => !!s);

            // save the article and navigate to the article page
            let result = await this.articlesService.saveArticleAsync(article);
            this.getApplication()!.navigate("/article/" + result.slug);
        } catch (err) {
            this.showConfirmationDialogAsync(err.message);
        }
        this.loading = false;
    }
}

EditorActivity.addObserver(
    class {
        constructor(public readonly activity: EditorActivity) {}
        onMatchChangeAsync() {
            if (!this.activity.match) return;

            // figure out if the user wants to edit an article or start new:
            let slug = this.activity.match.path.replace(/^\/?editor\/?/, "");
            if (slug) this.activity.loadAsync(slug);
            else this.activity.clearForm();
        }
    }
);
