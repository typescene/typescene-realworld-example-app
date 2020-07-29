import {
    bind,
    UICenterRow,
    UIColumn,
    UIFlowCell,
    UIFormContextController,
    UIHeading2,
    UILinkButton,
    UIOppositeRow,
    UIPrimaryButton,
    UIRow,
    UIScrollContainer,
    UISeparator,
    UISpacer,
    UITextField,
} from "typescene";
import NavBar from "../../../shared/NavBar";
import * as styles from "../../../styles";

export default UIScrollContainer.with(
    NavBar,
    UIFlowCell.with(
        {
            dimensions: { width: "100%", maxWidth: 470 },
            position: { gravity: "center" },
            padding: 24,
        },

        // form heading:
        UICenterRow.with(UIHeading2.withText("Your Settings", { fontSize: 40 })),
        UISpacer.withHeight(32),

        // actual input form, fields automatically bind to `formContext` object:
        UIColumn.with(
            { spacing: 16 },
            UIRow.with(
                UITextField.with({
                    placeholder: "URL of profile picture",
                    name: "image",
                    style: styles.formFieldStyle.extend({
                        textStyle: { fontSize: 14 },
                    }),
                })
            ),
            UIRow.with(
                UITextField.with({
                    placeholder: "Username",
                    name: "username",
                    style: styles.formFieldStyle,
                    requestFocus: true,
                })
            ),
            UIRow.with(
                UITextField.with({
                    placeholder: "Short bio about you",
                    name: "bio",
                    multiline: true,
                    dimensions: { height: 200 },
                    style: styles.formFieldStyle.extend({
                        textStyle: { lineHeight: 1.4 },
                        decoration: { css: { paddingTop: ".5rem" } },
                    }),
                })
            ),
            UIRow.with(
                UITextField.with({
                    placeholder: "Email",
                    name: "email",
                    style: styles.formFieldStyle,
                })
            ),
            UIRow.with(
                UITextField.with({
                    placeholder: "New password",
                    name: "password",
                    type: "password",
                    style: styles.formFieldStyle,
                })
            ),

            // submit button:
            UIOppositeRow.with(
                UIPrimaryButton.with({
                    label: "Update Settings",
                    disabled: bind("loading"),
                    style: styles.formButtonStyle,
                    onClick: "submit()",
                })
            )
        ),

        // logout button:
        UISeparator.with({ margin: 16 }),
        UIRow.with(
            UILinkButton.with({
                label: "Logout",
                onClick: "doLogout()",
                textStyle: { color: "@red" },
            })
        ),
        UISpacer.withHeight(64)
    )
);
