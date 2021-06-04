import { UIButton, UIColor, UIOutlineButton, UIStyle } from "typescene";

/** Style specifically for favorite button */
const favButtonStyle = UIStyle.create({
  position: { gravity: "start" },
  dimensions: { minWidth: 0 },
  textStyle: { fontSize: 14, lineHeight: 2 },
  decoration: {
    background: "transparent",
    borderRadius: 4,
    padding: { y: 0, x: 12 },
  },
})
  .addState("hover", {
    textStyle: { color: UIColor.Primary.lum(-0.2, true).text() },
  })
  .addState("selected", {
    decoration: { background: UIColor.Primary.lum(-0.2, true) },
    textStyle: { color: UIColor.Primary.lum(-0.2, true).text() },
  });

/** Favorite button (label to be provided using preset) */
export default class FavButton extends UIOutlineButton.with({
  icon: "♥",
  iconSize: 12,
  iconMargin: 4,
  style: favButtonStyle,
}) {
  static preset(presets: UIButton.Presets & { selected?: boolean }) {
    return super.preset(presets);
  }

  selected?: boolean;
}

FavButton.addObserver(
  class {
    constructor(public readonly btn: FavButton) {}

    // select button if bound 'selected' property is set to true
    onSelectedChange() {
      if (this.btn.selected) this.btn.emitAction("Select");
      else this.btn.emitAction("Deselect");
    }

    // update selection status immediately after rendering
    onRendered() {
      if (this.btn.selected) this.onSelectedChange();
    }
  }
);
