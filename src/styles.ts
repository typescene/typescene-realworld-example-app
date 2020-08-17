import { UIStyle } from "typescene";

const bannerButtonStyle = UIStyle.create({
    dimensions: { minWidth: 0 },
    textStyle: { fontSize: 14, color: "@text/50%" },
    decoration: {
        background: "transparent",
        borderThickness: 1,
        borderColor: "@text/50%",
        css: { padding: ".25rem .5rem" },
    },
}).addState("hover", {
    decoration: { background: "@text/25%" },
});

export const styles = UIStyle.group({
    /** Article page heading style */
    articleHeading: {
        textStyle: {
            fontFamily: "Merriweather Sans,sans-serif",
            fontWeight: 300,
            fontSize: 48,
            lineBreakMode: "normal",
        },
    },
    /** Text field style used across different forms */
    formField: {
        decoration: {
            css: { padding: "0 1rem" },
        },
        textStyle: {
            fontSize: 20,
            lineHeight: 2.5,
        },
    },
    /** Button style used across different forms */
    formButton: UIStyle.create({
        dimensions: {
            minWidth: 120,
        },
        textStyle: {
            color: "@primary^-20%.text",
            lineHeight: 1.8,
            fontSize: 20,
        },
    }).addState("disabled", {
        decoration: { background: "@primary/50%" },
        textStyle: { color: "@primary^-20%.text" },
    }),

    /** Button style used in banners and for other 'minor' buttons */
    bannerButton: bannerButtonStyle,
    reverseBannerButton: bannerButtonStyle
        .extend({
            textStyle: { color: "@background/50%" },
            decoration: { borderThickness: 1, borderColor: "@background/50%" },
        })
        .addState("hover", {
            textStyle: { color: "@background" },
            decoration: { background: "@background/25%" },
        }),
    redBannerButton: bannerButtonStyle
        .extend({
            textStyle: { color: "@red" },
            decoration: { borderThickness: 1, borderColor: "@red" },
        })
        .addState("hover", {
            textStyle: { color: "@red" },
            decoration: { background: "@red/25%" },
        })
        .addState("pressed", {
            textStyle: { color: "@red.text" },
            decoration: { background: "@red" },
        }),

    /** Tag button/label style, for list of tags */
    tagButton: UIStyle.create("TagButton", {
        dimensions: { minWidth: 32 },
        textStyle: {
            fontSize: 11,
            bold: true,
            color: "@background",
        },
        decoration: {
            borderThickness: 0,
            borderRadius: 16,
            background: "@background^-40%",
            css: {
                cursor: "pointer",
            },
        },
    })
        .addState("hover", {
            textStyle: { color: "@background" },
            decoration: { background: "@background^-60%" },
        })
        .addState("pressed", {
            textStyle: { color: "@primary^-20%.text" },
            decoration: { background: "@primary^-20%" },
        }),
});
