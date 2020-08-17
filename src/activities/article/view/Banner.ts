import { bind, UIFlowCell, UIHeading1, UISpacer } from "typescene";
import { styles } from "../../../styles";
import ArticleButtons from "./ArticleButtons";

export default UIFlowCell.with(
    {
        background: "@text^-3%",
        textColor: "@background",
        dimensions: { minHeight: 185 },
        padding: { y: 16 },
    },
    UIFlowCell.with(
        {
            padding: { top: 24, x: 8 },
            dimensions: { width: "100%", maxWidth: 940 },
            position: { gravity: "center" },
        },

        // article heading (title)
        UIHeading1.with({
            text: bind("article.title"),
            style: styles.articleHeading,
        }),
        UISpacer.withHeight(24),

        // buttons (follow/fave/edit/delete)
        ArticleButtons
    )
);
