import {
    Application,
    bind,
    service,
    UICloseColumn,
    UICloseLabel,
    UIFlowCell,
    UIHeading1,
    UIImage,
    UILinkButton,
    UIListCellAdapter,
    UIParagraph,
    UIRow,
    UISpacer,
} from "typescene";
import { Article } from "../services/Articles";
import { UserService } from "../services/User";
import FavButton from "./FavButton";

/** Article preview header, including author link and date */
const ArticleHeader = UIRow.with(
    UIImage.with({
        url: bind("object.author.image"),
        dimensions: { width: 32, height: 32 },
        decoration: {
            borderRadius: 30,
            css: { cursor: "pointer" },
        },
        onClick: "goToProfile()",
    }),
    UICloseColumn.with(
        UILinkButton.with({
            label: bind("object.author.username"),
            dimensions: { width: "100%" },
            textStyle: { align: "start" },
            decoration: { css: { padding: "0" } },
            onClick: "goToProfile()",
        }),
        UICloseLabel.with({
            text: bind("object.createdAt|local:date"),
            textStyle: { fontSize: 12.8, color: "@text/30%" },
        })
    ),
    UISpacer,
    FavButton.with({
        hidden: bind("!userService.profile"),
        label: bind("object.favoritesCount"),
        selected: bind("object.favorited"),
        onClick: "+FavButtonClicked",
    })
);

/** List item view adapter for article previews */
export default class ArticlePreview extends UIListCellAdapter.with(
    {
        padding: { y: 24 },
        // NOTE: this is a flexbox trick that stops this box
        // from widening its parent:
        dimensions: { minWidth: "100%", width: 0 },
    },

    // header including author link and fav button
    ArticleHeader,

    // article preview (title, description)
    UIFlowCell.with(
        {
            css: { cursor: "pointer" },
            onClick: "+ArticleClicked",
        },
        UIRow.with(
            UIHeading1.with({
                text: bind("object.title"),
                dimensions: { grow: 0 },
                textStyle: { fontSize: 26, fontWeight: 700 },
            })
        ),
        UIRow.with(
            UIParagraph.with({
                text: bind("object.description"),
                textStyle: { fontFamily: "Source Serif Pro, serif" },
            })
        ),
        UIRow.with(
            UILinkButton.with({
                label: "Read more...",
                textStyle: { fontSize: 12.8, color: "@text/30%" },
                decoration: { css: { padding: "0" } },
            })
        )
    )
) {
    @service("App.User")
    userService!: UserService;

    /** Article reference (override type) */
    object!: Article;

    /** Event handler, navigates to the author's profile page */
    goToProfile() {
        this.getParentComponent(Application)!.navigate("/profile/" + this.object.author!.username);
    }
}
