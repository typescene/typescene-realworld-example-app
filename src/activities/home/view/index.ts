import { bind, UIFlowCell, UIRow, UIScrollContainer } from "typescene";
import { ArticleFeedList } from "../../../shared/ArticleFeedList";
import NavBar from "../../../shared/NavBar";
import Banner from "./Banner";
import TabBar from "./TabBar";
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
                layout: { wrapContent: true }
            },
            UIFlowCell.with(
                {
                    dimensions: { minWidth: "60%", shrink: 1, grow: 100 },
                    position: { gravity: "start" }
                },
                TabBar,
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
            TagList.with({
                onSelectTag: "selectTag()"
            })
        )
    )
)
