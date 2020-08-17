import {
    UIBorderlessButton,
    UIButton,
    UICell,
    UIRenderableConstructor,
    UIScrollContainer,
    UISelectionController,
    UIStyle,
} from "typescene";

// ============================================================================
// NOTE:
// This component should typically be pulled in from e.g. typescene-web-nav
// package, however for the purposes of this sample app we'll include the
// full version here.
// ============================================================================

const styles = UIStyle.group({
    bar: {
        position: { gravity: "stretch" },
        containerLayout: { axis: "horizontal", distribution: "start" },
        dimensions: { grow: 0 },
        decoration: { css: { zIndex: "10" } },
    },
    button: UIStyle.create("TabBarButton", {
        position: { gravity: "end" },
        dimensions: { height: 42, maxHeight: 42, minWidth: 32, shrink: 0 },
        textStyle: { align: "start", color: "@text" },
        decoration: {
            borderRadius: 0,
            background: "transparent",
            css: {
                paddingLeft: "1rem",
                paddingRight: "1rem",
                borderLeft: "0",
                borderRight: "0",
                transition: "all .2s ease-in-out",
            },
        },
    })
        .addState("hover", {
            decoration: { background: "@background^-3%" },
            textStyle: { color: "@primary" },
        })
        .addState("focused", {
            decoration: { background: "@background^-3%", dropShadow: 0.1 },
        })
        .addState("selected", {
            textStyle: { color: "@primary" },
            decoration: {
                borderThickness: 2,
                borderColor: "@primary",
                css: { borderLeft: "0", borderRight: "0", borderTopColor: "transparent" },
            },
        }),
});

/** A button with predefined styles for use within a tab bar */
export class TabBarButton extends UIBorderlessButton {
    static preset(presets: UIButton.Presets & { selected: boolean }) {
        return super.preset(presets);
    }

    constructor(label?: string) {
        super(label);
        this.style = this.style.mixin(styles.button);
    }

    selected?: boolean;
}
TabBarButton.addObserver(
    class {
        constructor(public readonly button: TabBarButton) {}
        onSelectedChangeAsync() {
            if (this.button.selected) {
                this.button.propagateComponentEvent("Select");
            } else {
                this.button.propagateComponentEvent("Deselect");
            }
        }
        onRendered() {
            if (this.button.selected) {
                this.button.propagateComponentEvent("Select");
            }
        }
        onSelect() {
            this.button.selected = true;
        }
        onDeselect() {
            this.button.selected = false;
        }
        onClick() {
            this.button.propagateComponentEvent("Select");
        }
        onArrowLeftKeyPress() {
            this.button.requestFocusPrevious();
        }
        onArrowRightKeyPress() {
            this.button.requestFocusNext();
        }
    }
);

/** A bar containing tabs, for use with `TabBarButton` */
export class TabBar extends UICell {
    static preset(presets: UICell.Presets, ...content: Array<UIRenderableConstructor>) {
        return super.preset(
            presets,
            UISelectionController.with(
                UIScrollContainer.with(
                    {
                        layout: { axis: "horizontal" },
                        dimensions: { grow: 0 },
                        horizontalScrollEnabled: true,
                    },
                    ...content
                )
            )
        );
    }

    constructor() {
        super();

        // set properties here so they are overridden by style:
        this.borderColor = "@primary";
        this.borderStyle = "solid";
        this.borderThickness = "0 0 .0625rem 0";
        this.style = this.style.mixin(styles.bar);
    }
}
