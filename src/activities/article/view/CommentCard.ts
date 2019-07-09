import { Application, bind, ManagedObject, ManagedRecord, service, UICloseLabel, UIFlowCell, UIImage, UILinkButton, UIListCellAdapter, UIOutlineButton, UIParagraph, UIRow, UISeparator, UISpacer } from "typescene";
import { Comment } from "../../../services/Articles";
import { UserService } from "../../../services/User";
import * as styles from "../../../styles";

/** List item view adapter for a single comment */
export class CommentCard extends UIListCellAdapter.with(
    {
        borderColor: "@text/20%",
        borderRadius: 4,
        borderThickness: 1,
        margin: { bottom: 16 }
    },

    // comment text:
    UIFlowCell.with(
        { padding: { x: 24, y: 8 } },
        UIRow.with(
            UIParagraph.withText(bind("object.body"))
        )
    ),
    UISeparator,

    // meta data: author, timestamp
    UIFlowCell.with(
        {
            background: "@background^-5%",
            padding: { left: 24, right: 16, y: 8 }
        },
        UIRow.with(
            UIImage.with({
                url: bind("object.author.image"),
                dimensions: { width: 16, height: 16 },
                controlStyle: {
                    borderRadius: 16,
                    css: { cursor: "pointer" }
                },
                onClick: "goToProfile()"
            }),
            UILinkButton.with({
                label: bind("object.author.username"),
                textStyle: { fontSize: 12 },
                controlStyle: { css: { padding: "0" } },
                onClick: "goToProfile()"
            }),
            UICloseLabel.with({
                text: bind("object.createdAt|tt(date)"),
                textStyle: {
                    lineHeight: 1,
                    fontSize: 12,
                    color: "@text/50%"
                }
            }),
            UISpacer,

            // delete button if comment is added by user
            UIOutlineButton.with({
                hidden: bind("!isOwnProfile"),
                icon: "delete",
                disabled: bind("deleting"),
                style: styles.bannerButtonStyle,
                onClick: "+DeleteComment"
            })
        )
    )
) {
    constructor (object: ManagedObject) {
        super(object);
        this.isOwnProfile = !!this.userService.profile &&
            this.userService.profile.username === this.object.author!.username;
    }

    @service("App.User")
    userService!: UserService;

    /** Comment reference (override type) */
    object!: ManagedRecord & Comment;

    /** True if comment is written by user themselves */
    isOwnProfile?: boolean;

    /** True if currently deleting this comment (to disable button) */
    deleting?: boolean;

    /** Event handler: navigate to the author's profile page */
    goToProfile() {
        this.getParentComponent(Application)!.navigate(
            "/profile/" + this.object.author!.username);
    }
}