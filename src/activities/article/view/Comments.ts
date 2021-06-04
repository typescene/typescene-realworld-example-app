import {
  bind,
  UICenterRow,
  UICloseColumn,
  UIFlowCell,
  UILabel,
  UIListController,
} from "typescene";
import { CommentCard } from "./CommentCard";
import CommentEditor from "./CommentEditor";

const loginMessage = `
  <a href="#/login">Sign in</a>
  or <a href="#/register">sign up</a>
  to add comments.`;

export default UIFlowCell.with(
  {
    padding: { x: 8, top: 32 },
    dimensions: { width: "100%", maxWidth: 595 },
    position: { gravity: "center" },
  },

  // list of comments:
  UIListController.with(
    { items: bind("comments") },
    CommentCard,
    UICloseColumn
  ),

  // comment editor for posting new comments:
  CommentEditor,

  // message to be displayed if the user is not logged in:
  UICenterRow.with(
    { hidden: bind("userService.isLoggedIn") },
    UILabel.with({
      text: loginMessage,
      htmlFormat: true,
    })
  )
);
