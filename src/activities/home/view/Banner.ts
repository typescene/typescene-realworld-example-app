import { UICenterRow, UIFlowCell, UIHeading1, UILabel } from "typescene";

export default UIFlowCell.with(
    {
        background: "@primary",
        textColor: "@primary^-10%:text",
        padding: { y: 32 },
        dropShadow: -0.15,
    },
    UICenterRow.with(
        UIHeading1.with({
            text: "conduit",
            textStyle: {
                bold: true,
                fontSize: 56,
                lineHeight: 1.6,
            },
            decoration: {
                css: { textShadow: "0 1px 3px rgba(0,0,0,.3)" },
            },
        })
    ),
    UICenterRow.with(
        UILabel.withText("A place to share your knowledge.", {
            fontSize: 24,
            fontWeight: 100,
        })
    )
);
