import {
  bind,
  UICenterRow,
  UIColumn,
  UIForm,
  UIHeading2,
  UILinkButton,
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
      formContext: bind("inputForm"),
      dimensions: { width: "100%", maxWidth: 470 },
      position: { gravity: "center" },
      padding: 24,
    },

    // heading text:
    UICenterRow.with(UIHeading2.withText("Sign In", { fontSize: 40 })),
    UICenterRow.with(
      UILinkButton.with({
        label: "Need an account?",
        navigateTo: "/register",
      })
    ),
    UISpacer.withHeight(16),

    // form content:
    UIColumn.with(
      { spacing: 16 },
      UIRow.with(
        UITextField.with({
          placeholder: "Email",
          name: "email",
          disabled: bind("loading"),
          style: styles.formField,
          requestFocus: true,
        })
      ),
      UIRow.with(
        UITextField.with({
          placeholder: "Password",
          type: "password",
          name: "password",
          disabled: bind("loading"),
          style: styles.formField,
          onEnterKeyPress: "+TryLogin",
        })
      ),

      // submit button:
      UIOppositeRow.with(
        UIPrimaryButton.with({
          label: "Sign in",
          disabled: bind("loading"),
          style: styles.formButton,
          onClick: "+TryLogin",
        })
      )
    )
  )
);
