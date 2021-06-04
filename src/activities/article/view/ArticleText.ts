import {
  bind,
  UICloseLabel,
  UIFlowCell,
  UIListCellAdapter,
  UIListController,
  UIParagraph,
  UIRow,
  UISeparator,
} from "typescene";
import { styles } from "../../../styles";

export default UIFlowCell.with(
  {
    padding: { x: 8, top: 32 },
    dimensions: { width: "100%", maxWidth: 940 },
    position: { gravity: "center" },
  },

  // the actual HTML text:
  UIRow.with(
    UIParagraph.with({
      text: bind("bodyHtml"),
      htmlFormat: true,
      textStyle: {
        fontFamily: "Source Serif Pro, serif",
        fontSize: 19.2,
        lineBreakMode: "normal",
      },
    })
  ),

  // list of article tags:
  UIListController.with(
    { items: bind("tags") },
    UIListCellAdapter.with(
      {
        dimensions: { grow: 0 },
        margin: { right: 4, bottom: 6 },
      },
      UICloseLabel.with({
        text: bind("object.tag"),
        style: styles.tagButton.extend({
          decoration: {
            padding: { y: 4, x: 8 },
            css: { cursor: "auto" },
          },
        }),
      })
    ),
    UIRow.with({
      layout: { wrapContent: true },
    })
  ),

  // add a line to the bottom of the article:
  UISeparator.with({ margin: 24 })
);
