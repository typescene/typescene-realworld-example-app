import { UIColor, UIStyle } from "typescene";

const bannerButtonStyle = UIStyle.create({
  dimensions: { minWidth: 0 },
  textStyle: { fontSize: 14, color: UIColor.Text.alpha(0.5) },
  decoration: {
    background: "transparent",
    borderThickness: 1,
    borderColor: UIColor.Text.alpha(0.5),
    padding: { y: 4, x: 8 },
  },
}).addState("hover", {
  decoration: { background: UIColor.Text.alpha(0.25) },
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
      padding: { x: 16 },
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
      color: UIColor.Primary.lum(-0.2, true).text(),
      lineHeight: 1.8,
      fontSize: 20,
    },
  }).addState("disabled", {
    decoration: { background: UIColor.Primary.alpha(0.5) },
    textStyle: { color: UIColor.Primary.lum(-0.2, true).text() },
  }),

  /** Button style used in banners and for other 'minor' buttons */
  bannerButton: bannerButtonStyle,
  reverseBannerButton: bannerButtonStyle
    .extend({
      textStyle: { color: UIColor.Background.alpha(0.5) },
      decoration: {
        borderThickness: 1,
        borderColor: UIColor.Background.alpha(0.5),
      },
    })
    .addState("hover", {
      textStyle: { color: UIColor.Background },
      decoration: { background: UIColor.Background.alpha(0.25) },
    }),
  redBannerButton: bannerButtonStyle
    .extend({
      textStyle: { color: UIColor.Red },
      decoration: { borderThickness: 1, borderColor: UIColor.Red },
    })
    .addState("hover", {
      textStyle: { color: UIColor.Red },
      decoration: { background: UIColor.Red.alpha(0.25) },
    })
    .addState("pressed", {
      textStyle: { color: UIColor.Red.text() },
      decoration: { background: UIColor.Red },
    }),

  /** Tag button/label style, for list of tags */
  tagButton: UIStyle.create("TagButton", {
    dimensions: { minWidth: 32 },
    textStyle: {
      fontSize: 11,
      bold: true,
      color: UIColor.Background.lum(-0.5, true).text(),
    },
    decoration: {
      borderThickness: 0,
      borderRadius: 16,
      background: UIColor.Background.lum(-0.5, true),
      css: { cursor: "pointer" },
    },
  })
    .addState("hover", {
      textStyle: { color: UIColor.Background },
      decoration: { background: UIColor.Background.lum(-0.6, true) },
    })
    .addState("pressed", {
      textStyle: { color: UIColor.Primary.lum(-0.2, true).text() },
      decoration: { background: UIColor.Primary.lum(-0.2, true) },
    }),
});
