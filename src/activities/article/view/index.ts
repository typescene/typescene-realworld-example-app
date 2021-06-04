import {
  bind,
  UICenterRow,
  UIColor,
  UIFlowCell,
  UIHeading3,
  UIParagraph,
  UIScrollContainer,
  UIViewRenderer,
} from "typescene";
import NavBar from "../../../shared/NavBar";

export default UIScrollContainer.with(
  NavBar,

  // banner placeholder:
  UIFlowCell.with(
    {
      hidden: bind("activity.loaded"),
      background: UIColor.Text.alpha(0.97),
      textColor: UIColor.Background,
      dimensions: { height: 185 },
    },

    // error message if the article cannot be loaded:
    UIFlowCell.with(
      { hidden: bind("!error") },
      UICenterRow.with(UIHeading3.withText("Oops")),
      UICenterRow.with(
        UIParagraph.withText("An error occurred while loading this page.")
      )
    )
  ),

  // display the inner activity view when ready:
  UIViewRenderer.with({
    view: bind("activity"),
  })
);
