import {
    bind,
    bindf,
    UICloseColumn,
    UICloseLabel,
    UICloseRow,
    UIFlowCell,
    UIImage,
    UILinkButton,
    UIOutlineButton,
    UIRow,
    UISpacer,
} from "typescene";
import FavButton from "../../../shared/FavButton";
import * as styles from "../../../styles";

export default UIRow.with(
    // author information and timestamp:
    UIImage.with({
        url: bind("article.author.image"),
        dimensions: { width: 32, height: 32 },
        decoration: {
            borderRadius: 30,
            css: { cursor: "pointer" },
        },
        onClick: "goToProfile()",
    }),
    UICloseColumn.with(
        UILinkButton.with({
            label: bind("article.author.username"),
            dimensions: { width: "100%" },
            textStyle: { align: "start", color: "inherit" },
            decoration: { css: { padding: "0" } },
            onClick: "goToProfile()",
        }),
        UICloseLabel.with({
            text: bind("article.createdAt|tt(date)"),
            textStyle: { fontSize: 12.8, color: "inherit" },
            decoration: { css: { opacity: ".5" } },
        })
    ),
    UISpacer.withWidth(16),

    // buttons: follow and fave, OR edit and delete
    UIFlowCell.with(
        { hidden: bind("!userService.profile") },
        UICloseRow.with(
            UIOutlineButton.with({
                hidden: bind("isOwnProfile"),
                label: bindf("${article.author.following|then(Unf)|or(F)}ollow ${article.author.username}"),
                icon: "add",
                iconMargin: 4,
                style: styles.reverseBannerButtonStyle,
                onClick: "toggleFollowProfile()",
            }),
            UIOutlineButton.with({
                hidden: bind("!isOwnProfile"),
                label: "Edit article",
                style: styles.reverseBannerButtonStyle,
                onClick: "editArticle()",
            }),
            UISpacer,
            UIOutlineButton.with({
                hidden: bind("!isOwnProfile"),
                label: "Delete",
                style: styles.redBannerButtonStyle,
                onClick: "deleteArticle()",
            }),
            FavButton.with({
                hidden: bind("isOwnProfile"),
                label: bindf("Favorite post (${article.favoritesCount})"),
                selected: bind("article.favorited"),
                onClick: "toggleArticleFav()",
            })
        )
    )
);
