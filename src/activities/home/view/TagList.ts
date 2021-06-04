import {
  bind,
  UICell,
  UICloseLabel,
  UIFlowCell,
  UIListCellAdapter,
  UIListController,
  UIRow,
  UISmallButton,
  UISpacer,
  UILabel,
  UIColor,
} from "typescene";
import { styles } from "../../../styles";

export default UIFlowCell.with(
  {
    position: { gravity: "start" },
    dimensions: { width: 0, minWidth: 245, grow: 1 },
    padding: { x: 8 },
  },
  UIFlowCell.with(
    {
      background: UIColor.Background.lum(-0.05, true),
      borderRadius: 4,
      padding: 8,
    },
    UIRow.with(UICloseLabel.withText("Popular Tags")),
    UISpacer,

    // tag list:
    UIListController.with(
      { items: bind("allTags") },

      // cell content:
      UIListCellAdapter.with(
        {
          dimensions: { grow: 0 },
          margin: { right: 4, bottom: 6 },
        },
        UISmallButton.with({
          label: bind("object.tag"),
          onClick: "+SelectTag",
          style: styles.tagButton,
        })
      ),

      // wrapper:
      UICell.with({
        layout: {
          distribution: "start",
          axis: "horizontal",
          wrapContent: true,
        },
      }),

      // bookend, empty state:
      UIFlowCell.with(
        { hidden: bind("!loading"), padding: 16 },
        UIRow.with(UILabel.withText("Loading..."))
      )
    )
  )
);
