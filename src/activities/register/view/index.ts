import { bind, UICenterRow, UIColumn, UIFlowCell, UIFormContextController, UIHeading2, UILinkButton, UIOppositeRow, UIPrimaryButton, UIRow, UIScrollContainer, UISpacer, UITextField } from "typescene";
import NavBar from "../../../shared/NavBar";
import * as styles from "../../../styles";

export default UIScrollContainer.with(
    NavBar,
    UIFlowCell.with(
        {
            dimensions: { width: "100%", maxWidth: 470 },
            position: { gravity: "center" },
            padding: 24
        },

        // form heading:
        UICenterRow.with(
            UIHeading2.withText("Sign Up", { fontSize: 40 }),
        ),
        UICenterRow.with(
            UILinkButton.with({
                label: "Have an account?",
                navigateTo: "/login"
            })
        ),
        UISpacer.withHeight(16),

        // the actual input form:
        UIFormContextController.with(
            { formContext: bind("inputForm") },
            UIColumn.with(
                { spacing: 16 },
                UIRow.with(
                    UITextField.with({
                        placeholder: "Username",
                        name: "username",
                        disabled: bind("loading"),
                        style: styles.formFieldStyle,
                        requestFocus: true
                    })
                ),
                UIRow.with(
                    UITextField.with({
                        placeholder: "Email",
                        name: "email",
                        disabled: bind("loading"),
                        style: styles.formFieldStyle
                    })
                ),
                UIRow.with(
                    UITextField.with({
                        placeholder: "Password",
                        type: "password",
                        name: "password",
                        disabled: bind("loading"),
                        style: styles.formFieldStyle,
                        onEnterKeyPress: "doLogin()"
                    })
                ),

                // submit button:
                UIOppositeRow.with(
                    UIPrimaryButton.with({
                        label: "Sign up",
                        disabled: bind("loading"),
                        style: styles.formButtonStyle,
                        onClick: "doRegister()"
                    })
                )
            )
        )
    )
)