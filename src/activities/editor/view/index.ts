import { bind, UIColumn, UIFlowCell, UIFormContextController, UIOppositeRow, UIPrimaryButton, UIRow, UIScrollContainer, UISpacer, UITextField } from "typescene";
import NavBar from "../../../shared/NavBar";
import * as styles from "../../../styles";

export default UIScrollContainer.with(
    NavBar,
    UIFlowCell.with(
        {
            dimensions: { width: "100%", maxWidth: 750 },
            position: { gravity: "center" },
            padding: 8
        },

        // the input form itself:
        UIFormContextController.with(
            { formContext: bind("article") },
            UIColumn.with(
                { spacing: 16 },
                UIRow.with(
                    UITextField.with({
                        placeholder: "Article Title",
                        name: "title",
                        style: styles.formFieldStyle
                    })
                ),
                UIRow.with(
                    UITextField.with({
                        placeholder: "Short description",
                        name: "description",
                        style: styles.formFieldStyle.extend({
                            textStyle: { fontSize: 16 }
                        })
                    })
                ),
                UIRow.with(
                    UITextField.with({
                        placeholder: "Write your article (in Markdown)",
                        name: "body",
                        multiline: true,
                        dimensions: { height: 280 },
                        style: styles.formFieldStyle.extend({
                            textStyle: { fontSize: 16, lineHeight: 1.4 },
                            controlStyle: { css: { paddingTop: ".5rem" } }
                        })
                    })
                ),
                UIRow.with(
                    UITextField.with({
                        placeholder: "Enter tags",
                        name: "tagsString",
                        style: styles.formFieldStyle.extend({
                            textStyle: { fontSize: 16 }
                        })
                    })
                ),
                UIOppositeRow.with(
                    UIPrimaryButton.with({
                        label: "Publish Article",
                        disabled: bind("loading"),
                        style: styles.formButtonStyle,
                        onClick: "submit()"
                    })
                )
            )
        ),
        UISpacer.withHeight(64),
    )
)