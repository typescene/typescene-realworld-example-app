import { bind } from "typescene";
import { TabBar, TabBarButton } from "../../../shared/TabBar";

export default TabBar.with(
    TabBarButton.with({
        label: bind("isOwnProfile|then(My Articles)|or(Articles)"),
        onClick: "showArticles()",
        selected: bind("visibleFeed").match("articles"),
    }),
    TabBarButton.with({
        label: "Favorites",
        onClick: "showFaves()",
        selected: bind("visibleFeed").match("fav"),
    })
);
