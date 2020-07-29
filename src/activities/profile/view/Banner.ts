import {
    bind,
    bindf,
    UICenterRow,
    UIColumn,
    UIFlowCell,
    UIHeading2,
    UIImage,
    UIOppositeRow,
    UIOutlineButton,
    UIParagraph,
} from "typescene";
import * as styles from "../../../styles";

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
                    color: "@text/50%",
                    fontWeight: 300,
                },
            })
        ),

        // follow/settings/logout buttons:
        UIFlowCell.with(
            { hidden: bind("!userService.profile") },
            UIOppositeRow.with(
                { hidden: bind("isOwnProfile") },
                UIOutlineButton.with({
                    label: bindf("${profile.following|then(Unf)|or(F)}ollow ${username}"),
                    icon: "add",
                    iconMargin: 4,
                    style: styles.bannerButtonStyle,
                    onClick: "toggleFollowProfile()",
                })
            ),
            UIOppositeRow.with(
                { hidden: bind("!isOwnProfile") },
                UIOutlineButton.with({
                    label: "Profile settings",
                    style: styles.bannerButtonStyle,
                    navigateTo: "/settings",
                }),
                UIOutlineButton.with({
                    label: "Logout",
                    style: styles.redBannerButtonStyle,
                    onClick: "doLogout()",
                })
            )
        )
    )
);
