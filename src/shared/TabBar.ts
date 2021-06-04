import {
  UICell,
  UIComponentEventHandler,
  UISelectionController,
  UIScrollContainer,
  UIRenderableConstructor,
  UIBorderlessButton,
  UIButton,
  UIStyle,
  observe,
} from "typescene";

// NOTE: this is taken from @typescene/web-nav
// Use that package as a dependency for production projects instead

/** Style for `TabBar` */
const _tabBarStyle = UIStyle.create("TabBar", {
  position: { gravity: "stretch" },
  containerLayout: { axis: "horizontal", distribution: "fill" },
  dimensions: { grow: 0 },
  decoration: {
    css: { zIndex: "10" },
    borderThickness: { bottom: 1 },
    borderColor: "@text/35%",
  },
});
const _tabBarInner = UIStyle.create("TabBar_inner", {
  containerLayout: {
    axis: "horizontal",
    distribution: "start",
  },
  dimensions: { width: "100%", grow: 0 },
});

/** Style for `TabBarButton` */
const _tabBarButtonStyle = UIStyle.create("TabBarButton", {
  position: { gravity: "end" },
  dimensions: { height: 42, maxHeight: 42, minWidth: 32, shrink: 0 },
  textStyle: { align: "start" },
  decoration: {
    textColor: "@text",
    borderRadius: 0,
    background: "transparent",
    borderThickness: 0,
    padding: { x: 16 },
    css: {
      transition: "all .2s ease-in-out",
    },
  },
})
  .addState("hover", {
    decoration: { background: "@primary/10%", textColor: "@primary" },
  })
  .addState("focused", {
    decoration: { background: "@primary/10%", dropShadow: 0.1 },
  })
  .addState("selected", {
    decoration: {
      textColor: "@primary",
      borderThickness: { bottom: 2, x: 0 },
      padding: { top: 2, x: 16 },
      borderColor: "@primary",
    },
  });

/**
 * A bar containing tabs, for use with `TabBarButtonView`
 */
export class TabBar extends UICell.with({ style: _tabBarStyle }) {
  static preset(
    presets: UICell.Presets,
    ...content: Array<UIRenderableConstructor | undefined>
  ) {
    return super.preset(
      presets,
      UISelectionController.with(
        UIScrollContainer.with(
          {
            style: _tabBarInner,
            horizontalScrollEnabled: true,
          },
          ...content
        )
      )
    );
  }
}

/**
 * Tab bar button, for use inside of `TabBarView`.
 */
export class TabBarButton extends UIBorderlessButton.with({
  style: _tabBarButtonStyle,
}) {
  static preset(
    presets: UIButton.Presets & {
      selected?: boolean;
      onSelect?: UIComponentEventHandler;
    }
  ) {
    return super.preset(presets);
  }
  selected?: boolean;

  @observe
  static TabBarButtonObserver = class {
    constructor(public readonly button: TabBarButton) {}
    onSelectedChangeAsync() {
      if (this.button.selected) {
        this.button.emitAction("Select");
      } else {
        this.button.emitAction("Deselect");
      }
    }
    onRendered() {
      if (this.button.selected) {
        this.button.emitAction("Select");
      }
    }
    onSelect() {
      this.button.selected = true;
    }
    onDeselect() {
      this.button.selected = false;
    }
    onClick() {
      this.button.emitAction("Select");
    }
    onArrowLeftKeyPress() {
      this.button.requestFocusPrevious();
    }
    onArrowRightKeyPress() {
      this.button.requestFocusNext();
    }
  };
}
