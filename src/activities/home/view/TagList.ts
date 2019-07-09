import { bind, tl, UICell, UICloseLabel, UIFlowCell, UIListCellAdapter, UIListController, UIRow, UISmallButton, UISpacer } from "typescene";
import * as styles from "../../../styles";

export default UIFlowCell.with(
    {
        position: { gravity: "start" },
        dimensions: { width: 0, minWidth: 245, grow: 1 },
        padding: { x: 8 }
    },
    UIFlowCell.with(
        {
            background: "@background^-5%",
            borderRadius: 4,
            padding: 8
        },
        UIRow.with(UICloseLabel.withText("Popular Tags")),
        UISpacer,
        UIFlowCell.with(
            { hidden: bind("!loading"), padding: 16 },
            UIRow.with(tl("Loading..."))
        ),
        UIListController.with(
            { items: bind("allTags") },
            UIListCellAdapter.with(
                {
                    dimensions: { grow: 0 },
                    margin: { right: 4, bottom: 6 },
                },
                UISmallButton.with({
                    label: bind("object.tag"),
                    onClick: "+SelectTag",
                    style: styles.tagButtonStyle
                }),
            ),
            UICell.with({
                layout: { distribution: "start", axis: "horizontal", wrapContent: true }
            })
        )
    )
)