import { UIButton, UIOutlineButton, UIStyle } from "typescene";

/** Style specifically for favorite button */
const favButtonStyle = UIStyle
    .create({
        position: { gravity: "start" },
        dimensions: { minWidth: 0 },
        textStyle: { fontSize: 14, lineHeight: 2 },
        controlStyle: {
            background: "transparent",
            borderRadius: 4,
            css: { padding: "0 .75rem" }
        }
    })
    .addState("hover", {
        textStyle: { color: "@primary^-20%:text" }
    })
    .addState("selected", {
        controlStyle: { background: "@primary^-20%" },
        textStyle: { color: "@primary^-20%:text" }
    })

/** Favorite button (label to be provided using preset) */
export default class FavButton extends UIOutlineButton.with({
    icon: "♥",
    iconSize: 12,
    iconMargin: 4,
    style: favButtonStyle
}) {
    static preset(presets: UIButton.Presets & { selected?: boolean }) {
        return super.preset(presets);
    }

    selected?: boolean;
}
FavButton.observe(class {
    constructor (public readonly btn: FavButton) { }

    // select button if bound 'selected' property is set to true
    onSelectedChange() {
        if (this.btn.selected) this.btn.propagateComponentEvent("Select");
        else this.btn.propagateComponentEvent("Deselect");
    }

    // update selection status immediately after rendering
    onRendered() {
        if (this.btn.selected) this.onSelectedChange();
    }
})
