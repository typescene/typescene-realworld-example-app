import { UIFlowCell, UISpacer } from "typescene";
import ArticleText from "./ArticleText";
import Banner from "./Banner";
import Comments from "./Comments";

export default UIFlowCell.with(
  Banner,
  ArticleText,
  Comments,
  UISpacer.withHeight(64)
);
