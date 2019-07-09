import { bind, bindf } from "typescene";
import { TabBar, TabBarButton } from "../../../shared/TabBar";

export default TabBar.with(
    TabBarButton.with({
        label: "Your Feed",
        onClick: "showProfileFeed()",
        hidden: bind("!userService.isLoggedIn"),
        selected: bind("visibleFeed").match("feed")
    }),
    TabBarButton.with({
        label: "Global Feed",
        onClick: "showGlobalFeed()",
        selected: bind("visibleFeed").match("global")
    }),
    TabBarButton.with({
        label: bindf("#${selectedTag}"),
        hidden: bind("!selectedTag"),
        selected: bind("visibleFeed").match("tag"),
        onClick: "showTagFeed()"
    })
)