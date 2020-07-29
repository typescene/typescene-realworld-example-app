import { UIStyle } from "typescene";

/** Article page heading style */
export const articleHeadingStyle = UIStyle.create({
    textStyle: {
        fontFamily: "Merriweather Sans,sans-serif",
        fontWeight: 300,
        fontSize: 48,
        lineBreakMode: "normal",
    },
});

/** Text field style used across different forms */
export const formFieldStyle = UIStyle.create({
    decoration: {
        css: { padding: "0 1rem" },
    },
    textStyle: {
        fontSize: 20,
        lineHeight: 2.5,
    },
});

/** Button style used across different forms */
export const formButtonStyle = UIStyle.create({
    dimensions: {
        minWidth: 120,
    },
    textStyle: {
        color: "@primary^-20%:text",
        lineHeight: 1.8,
        fontSize: 20,
    },
}).addState("disabled", {
    decoration: { background: "@primary/50%" },
    textStyle: { color: "@primary^-20%:text" },
});

/** Button style used in banners and for other 'minor' buttons */
export const bannerButtonStyle = UIStyle.create({
    dimensions: { minWidth: 0 },
    textStyle: { fontSize: 14, color: "@text/50%" },
    decoration: {
        background: "transparent",
        border: "1px solid @text/50%",
        css: { padding: ".25rem .5rem" },
    },
}).addState("hover", {
    decoration: { background: "@text/25%" },
});

/** Banner button style, in reverse color */
export const reverseBannerButtonStyle = bannerButtonStyle
    .extend({
        textStyle: { color: "@background/50%" },
        decoration: { border: "1px solid @background/50%" },
    })
    .addState("hover", {
        textStyle: { color: "@background" },
        decoration: { background: "@background/25%" },
    });

/** Banner button style, in red */
export const redBannerButtonStyle = bannerButtonStyle
    .extend({
        textStyle: { color: "@red" },
        decoration: { border: "1px solid @red" },
    })
    .addState("hover", {
        textStyle: { color: "@red" },
        decoration: { background: "@red/25%" },
    })
    .addState("pressed", {
        textStyle: { color: "@red:text" },
        decoration: { background: "@red" },
    });

/** Tag button/label style, for list of tags */
export const tagButtonStyle = UIStyle.create("TagButton", {
    dimensions: { minWidth: 32 },
    textStyle: {
        fontSize: 11,
        bold: true,
        color: "@background",
    },
    decoration: {
        border: "0",
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
        textStyle: { color: "@primary^-20%:text" },
        decoration: { background: "@primary^-20%" },
    });
