import { UICenterRow, UIFlowCell, UIHeading1, UILabel, UIStyle } from "typescene";

const styles = UIStyle.group({
    Banner: {
        decoration: {
            background: "@primary",
            textColor: "@primary^-10%:text",
            padding: { y: 32 },
            dropShadow: -0.15,
        },
    },
    HeadingText: {
        textStyle: {
            bold: true,
            fontSize: 56,
            lineHeight: 1.6,
        },
        decoration: {
            css: { textShadow: "0 1px 3px rgba(0,0,0,.3)" },
        },
    },
    Subtitle: {
        textStyle: {
            fontSize: 24,
            fontWeight: 100,
        },
    },
});

export default UIFlowCell.with(
    { style: styles.Banner },
    UICenterRow.with(UIHeading1.withText("conduit", styles.HeadingText)),
    UICenterRow.with(UILabel.withText("A place to share your knowledge.", styles.Subtitle))
);
