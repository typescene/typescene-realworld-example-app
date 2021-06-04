import {
  bind,
  UIColumn,
  UIForm,
  UIOppositeRow,
  UIPrimaryButton,
  UIRow,
  UIScrollContainer,
  UISpacer,
  UITextField,
} from "typescene";
import NavBar from "../../../shared/NavBar";
import { styles } from "../../../styles";

export default UIScrollContainer.with(
  NavBar,
  UIForm.with(
    {
      dimensions: { width: "100%", maxWidth: 750 },
      position: { gravity: "center" },
      padding: 8,
    },

    // form fields:
    UIColumn.with(
      { spacing: 16 },
      UIRow.with(
        UITextField.with({
          placeholder: "Article Title",
          name: "title",
          style: styles.formField,
        })
      ),
      UIRow.with(
        UITextField.with({
          placeholder: "Short description",
          name: "description",
          style: styles.formField.extend({
            textStyle: { fontSize: 16 },
          }),
        })
      ),
      UIRow.with(
        UITextField.with({
          placeholder: "Write your article (in Markdown)",
          name: "body",
          multiline: true,
          dimensions: { height: 280 },
          style: styles.formField.extend({
            textStyle: { fontSize: 16, lineHeight: 1.4 },
            decoration: { css: { paddingTop: ".5rem" } },
          }),
        })
      ),
      UIRow.with(
        UITextField.with({
          placeholder: "Enter tags",
          name: "tagsString",
          style: styles.formField.extend({
            textStyle: { fontSize: 16 },
          }),
        })
      ),
      UIOppositeRow.with(
        UIPrimaryButton.with({
          label: "Publish Article",
          disabled: bind("loading"),
          style: styles.formButton,
          onClick: "+Submit",
        })
      )
    ),
    UISpacer.withHeight(64)
  )
);
