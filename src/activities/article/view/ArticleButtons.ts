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
import { styles } from "../../../styles";

export default UIRow.with(
  // author information and timestamp:
  UIImage.with({
    url: bind("article.author.image"),
    dimensions: { width: 32, height: 32 },
    decoration: {
      borderRadius: 30,
      css: { cursor: "pointer" },
    },
    onClick: "+GoToProfile",
  }),
  UICloseColumn.with(
    UILinkButton.with({
      label: bind("article.author.username"),
      dimensions: { width: "100%" },
      textStyle: { align: "start", color: "inherit" },
      decoration: { padding: 0 },
      onClick: "+GoToProfile",
    }),
    UICloseLabel.with({
      text: bind("article.createdAt|local:date"),
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
        label: bindf(
          "%{then:Unfollow:Follow} %s",
          "article.author.following",
          "article.author.username"
        ),
        icon: "add",
        iconMargin: 4,
        style: styles.reverseBannerButton,
        onClick: "+ToggleFollowProfile",
      }),
      UIOutlineButton.with({
        hidden: bind("!isOwnProfile"),
        label: "Edit article",
        style: styles.reverseBannerButton,
        onClick: "+EditArticle",
      }),
      UISpacer,
      UIOutlineButton.with({
        hidden: bind("!isOwnProfile"),
        label: "Delete",
        style: styles.redBannerButton,
        onClick: "+DeleteArticle",
      }),
      FavButton.with({
        hidden: bind("isOwnProfile"),
        label: bindf("Favorite post (%i)", "article.favoritesCount"),
        selected: bind("article.favorited"),
        onClick: "+ToggleArticleFav",
      })
    )
  )
);
