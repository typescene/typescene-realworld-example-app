import {
    bind,
    UIBorderlessTextField,
    UIFlowCell,
    UIImage,
    UIPrimaryButton,
    UIRow,
    UISeparator,
    UISpacer,
} from "typescene";
import * as styles from "../../../styles";

export default UIFlowCell.with(
    {
        hidden: bind("!userService.isLoggedIn"),
        borderColor: "@text/20%",
        borderRadius: 4,
        borderThickness: 1,
        layout: { clip: true },
    },

    // top part of the editor card: text field itself
    UIFlowCell.with(
        UIRow.with(
            UIBorderlessTextField.with({
                placeholder: "Write a comment...",
                value: bind("commentDraft"),
                onInput: "updateCommentDraft()",
                multiline: true,
                dimensions: { height: 100 },
                style: styles.formFieldStyle.extend({
                    decoration: {
                        background: "@white",
                        css: { padding: "1rem .5rem" },
                    },
                    textStyle: { fontSize: 16, lineHeight: 1.4 },
                }),
            })
        )
    ),
    UISeparator,

    // meta data and submit button
    UIFlowCell.with(
        {
            background: "@background^-5%",
            padding: { left: 24, right: 16, y: 8 },
        },
        UIRow.with(
            UIImage.with({
                url: bind("userService.profile.image"),
                dimensions: { width: 16, height: 16 },
                decoration: { borderRadius: 16 },
            }),
            UISpacer,

            // submit button (disabled when comment field is empty)
            UIPrimaryButton.with({
                label: "Post Comment",
                disabled: bind("!commentDraft"),
                onClick: "postComment()",
                style: styles.formButtonStyle.extend({
                    textStyle: { fontSize: 14, lineHeight: 1, bold: true },
                }),
            })
        )
    )
);
