import { bind, bindf, UIFlowCell, UIRow, UIScrollContainer } from "typescene";
import { ArticleFeedList } from "../../../shared/ArticleFeedList";
import { TabBar, TabBarButton } from "../../../shared/TabBar";
import NavBar from "../../../shared/NavBar";
import Banner from "./Banner";
import TagList from "./TagList";

export default UIScrollContainer.with(
  NavBar,
  Banner,
  UIFlowCell.with(
    { padding: { x: 16, y: 32 } },
    UIRow.with(
      {
        dimensions: { width: "100%", maxWidth: 940 },
        position: { gravity: "center" },
        layout: { wrapContent: true },
      },
      UIFlowCell.with(
        {
          dimensions: { minWidth: "60%", shrink: 1, grow: 100 },
          position: { gravity: "start" },
        },

        // Tab bar and tab content:
        TabBar.with(
          TabBarButton.with({
            label: "Your Feed",
            onClick: "+ShowProfileFeed",
            hidden: bind("!userService.isLoggedIn"),
            selected: bind("visibleFeed").match("feed"),
          }),
          TabBarButton.with({
            label: "Global Feed",
            onClick: "+ShowGlobalFeed",
            selected: bind("visibleFeed").match("global"),
          }),
          TabBarButton.with({
            label: bindf("#${selectedTag}"),
            hidden: bind("!selectedTag"),
            selected: bind("visibleFeed").match("tag"),
            onClick: "+ShowTagFeed",
          })
        ),
        UIFlowCell.with(
          { hidden: bind("visibleFeed").nonMatch("feed") },
          ArticleFeedList.with({ feed: bind("profileFeed") })
        ),
        UIFlowCell.with(
          { hidden: bind("visibleFeed").nonMatch("global") },
          ArticleFeedList.with({ feed: bind("globalFeed") })
        ),
        UIFlowCell.with(
          { hidden: bind("visibleFeed").nonMatch("tag") },
          ArticleFeedList.with({ feed: bind("tagFeed") })
        )
      ),

      // tag list (on the side, wrapped if needed)
      TagList
    )
  )
);
