import { bind, bindf, UIFlowCell, UIScrollContainer } from "typescene";
import { ArticleFeedList } from "../../../shared/ArticleFeedList";
import NavBar from "../../../shared/NavBar";
import { TabBar, TabBarButton } from "../../../shared/TabBar";
import Banner from "./Banner";

export default UIScrollContainer.with(
  NavBar,

  // profile heading banner:
  Banner,

  // main content:
  UIFlowCell.with(
    { padding: { x: 16, y: 32 } },
    UIFlowCell.with(
      {
        dimensions: { width: "100%", maxWidth: 750 },
        position: { gravity: "center" },
      },

      // tabs, followed by content:
      TabBar.with(
        TabBarButton.with({
          label: bindf("%{then:My Articles:Articles}", "isOwnProfile"),
          onClick: "+ShowArticles",
          selected: bind("visibleFeed").match("articles"),
        }),
        TabBarButton.with({
          label: "Favorites",
          onClick: "+ShowFaves",
          selected: bind("visibleFeed").match("fav"),
        })
      ),
      UIFlowCell.with(
        { hidden: bind("visibleFeed").nonMatch("articles") },
        ArticleFeedList.with({ feed: bind("articlesFeed") })
      ),
      UIFlowCell.with(
        { hidden: bind("visibleFeed").nonMatch("faves") },
        ArticleFeedList.with({ feed: bind("favesFeed") })
      )
    )
  )
);
