import { bind, bindf } from "typescene";
import { TabBar, TabBarButton } from "../../../shared/TabBar";

export default TabBar.with(
    TabBarButton.with({
        label: bindf("%{then:My Articles:Articles}", "isOwnProfile"),
        onClick: "showArticles()",
        selected: bind("visibleFeed").match("articles"),
    }),
    TabBarButton.with({
        label: "Favorites",
        onClick: "showFaves()",
        selected: bind("visibleFeed").match("fav"),
    })
);
