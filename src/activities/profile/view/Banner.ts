import {
  bind,
  bindf,
  UICenterRow,
  UIColor,
  UIColumn,
  UIFlowCell,
  UIHeading2,
  UIImage,
  UIOppositeRow,
  UIOutlineButton,
  UIParagraph,
} from "typescene";
import { styles } from "../../../styles";

export default UIFlowCell.with(
  {
    background: "@background^-5%",
    dimensions: { minHeight: 275 },
    padding: { top: 32, bottom: 16 },
  },
  UIColumn.with(
    {
      hidden: bind("!profile"),
      dimensions: { width: "100%", maxWidth: 750 },
      layout: { gravity: "center" },
      position: { gravity: "center" },
    },

    // profile banner information:
    UIImage.with({
      url: bind("profile.image"),
      dimensions: { width: 100, height: 100 },
      decoration: { borderRadius: 100 },
    }),
    UICenterRow.with(
      UIHeading2.with({
        text: bind("username"),
        textStyle: { bold: true },
      })
    ),
    UICenterRow.with(
      UIParagraph.with({
        text: bind("profile.bio"),
        textStyle: {
          align: "center",
          color: UIColor.Text.alpha(0.5),
          fontWeight: 300,
        },
      })
    ),

    // follow/settings/logout buttons:
    UIFlowCell.with(
      { hidden: bind("!userService.profile") },

      // other profile
      UIOppositeRow.with(
        { hidden: bind("isOwnProfile") },
        UIOutlineButton.with({
          label: bindf(
            "%{then:Unfollow:Follow} %s",
            "profile.following",
            "username"
          ),
          icon: "add",
          iconMargin: 4,
          style: styles.bannerButton,
          onClick: "+ToggleFollowProfile",
        })
      ),

      // own profile
      UIOppositeRow.with(
        { hidden: bind("!isOwnProfile") },
        UIOutlineButton.with({
          label: "Profile settings",
          style: styles.bannerButton,
          navigateTo: "/settings",
        }),
        UIOutlineButton.with({
          label: "Logout",
          style: styles.redBannerButton,
          onClick: "+Logout",
        })
      )
    )
  )
);
