import {
  Application,
  bind,
  service,
  UICloseLabel,
  UIFlowCell,
  UIImage,
  UILinkButton,
  UIListCellAdapter,
  UIOutlineButton,
  UIParagraph,
  UIRow,
  UISeparator,
  UISpacer,
  ManagedObject,
  UIColor,
} from "typescene";
import { Comment } from "../../../services/Articles";
import { UserService } from "../../../services/User";
import { styles } from "../../../styles";

/** List item view adapter for a single comment */
export class CommentCard extends UIListCellAdapter.with(
  {
    borderColor: UIColor.Text.alpha(0.2),
    borderRadius: 4,
    borderThickness: 1,
    margin: { bottom: 16 },
  },

  // comment text:
  UIFlowCell.with(
    { padding: { x: 24, y: 8 } },
    UIRow.with(UIParagraph.withText(bind("object.body")))
  ),
  UISeparator,

  // meta data: author, timestamp
  UIFlowCell.with(
    {
      background: UIColor.Background.lum(-0.05, true),
      padding: { left: 24, right: 16, y: 8 },
    },
    UIRow.with(
      UIImage.with({
        url: bind("object.author.image"),
        dimensions: { width: 16, height: 16 },
        decoration: {
          borderRadius: 16,
          css: { cursor: "pointer" },
        },
        onClick: "+GoToProfile",
      }),
      UILinkButton.with({
        label: bind("object.author.username"),
        textStyle: { fontSize: 12 },
        decoration: { css: { padding: "0" } },
        onClick: "+GoToProfile",
      }),
      UICloseLabel.with({
        text: bind("object.createdAt|local:date"),
        textStyle: {
          lineHeight: 1,
          fontSize: 12,
          color: UIColor.Text.alpha(0.5),
        },
      }),
      UISpacer,

      // delete button if comment is added by user
      UIOutlineButton.with({
        hidden: bind("!isOwnProfile"),
        icon: "delete",
        disabled: bind("deleting"),
        style: styles.bannerButton,
        onClick: "+DeleteComment",
      })
    )
  )
) {
  constructor(object: ManagedObject) {
    super(object);
    this.isOwnProfile =
      !!this.userService.profile &&
      this.userService.profile.username === this.object.author!.username;
  }

  @service("App.User")
  userService!: UserService;

  /** Comment reference (override type) */
  object!: Comment;

  /** True if comment is written by user themselves */
  isOwnProfile?: boolean;

  /** True if currently deleting this comment (to disable button) */
  deleting?: boolean;

  /** Event handler: navigate to the author's profile page */
  onGoToProfile() {
    this.getParentComponent(Application)!.navigate(
      "/profile/" + this.object.author!.username
    );
  }
}
