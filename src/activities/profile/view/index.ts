import { bind, UIFlowCell, UIScrollContainer } from "typescene";
import { ArticleFeedList } from "../../../shared/ArticleFeedList";
import NavBar from "../../../shared/NavBar";
import Banner from "./Banner";
import TabBar from "./TabBar";

export default UIScrollContainer.with(
    NavBar,

    // profile heading banner:
    Banner,

    // article feeds, including tab bar:
    UIFlowCell.with(
        { padding: { x: 16, y: 32 } },
        UIFlowCell.with(
            {
                dimensions: { width: "100%", maxWidth: 750 },
                position: { gravity: "center" }
            },
            TabBar,
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
)
