import {
  Application,
  bind,
  service,
  UICell,
  UICloseColumn,
  UICloseRow,
  UIColor,
  UIHeading1,
  UIImage,
  UILinkButton,
  UIOppositeRow,
  UIRow,
  ViewComponent,
} from "typescene";
import { UserService } from "../services/User";

/** Nav bar heading ("conduit" logo) */
const LogoHeading = UIHeading1.with({
  text: "conduit",
  decoration: {
    css: { cursor: "pointer" },
  },
  textStyle: {
    fontSize: 24,
    lineHeight: 1,
    bold: true,
    color: UIColor.Primary,
  },
  onClick() {
    this.getBoundParentComponent(Application)!.navigate("/");
  },
});

/** Nav bar links used when there is no user logged in */
const LoggedOutLinks = UIOppositeRow.with(
  { hidden: bind("user.isLoggedIn") },
  UILinkButton.with({
    label: "Sign in",
    navigateTo: "/login",
  }),
  UILinkButton.with({
    label: "Sign up",
    navigateTo: "/register",
  })
);

/** Nav bar links used when there is a user logged in */
const LoggedInLinks = UIOppositeRow.with(
  { hidden: bind("!user.isLoggedIn") },
  UILinkButton.with({
    label: "New Article",
    navigateTo: "/editor",
  }),
  UILinkButton.with({
    label: "Settings",
    navigateTo: "/settings",
  }),
  UICloseRow.with(
    UIImage.with({
      hidden: bind("!user.profile.image"),
      url: bind("user.profile.image"),
      dimensions: { height: 16, width: 16 },
      decoration: { borderRadius: 16 },
    }),
    UILinkButton.with({
      dimensions: { shrink: 0 },
      label: bind("user.profile.username"),
      onClick: "+GoToProfile",
    })
  )
);

/** Top navigation bar, displayed on every page */
export default class NavBar extends ViewComponent.with(
  UICell.with(
    {
      dimensions: { height: 56, grow: 0 },
      background: UIColor.Background,
    },

    // inner block, centered, limited width:
    UICell.with(
      {
        dimensions: { width: "100%", maxWidth: 940 },
        position: { gravity: "center" },
        padding: 8,
      },
      UIRow.with(
        LogoHeading,
        UICloseColumn.with(
          { dimensions: { grow: 1 } },
          LoggedOutLinks,
          LoggedInLinks
        )
      )
    )
  )
) {
  @service("App.User")
  user?: UserService;

  /** Event handler, navigates to the user's own profile page */
  onGoToProfile() {
    this.getParentComponent(Application)!.navigate(
      "/profile/" + this.user!.profile!.username
    );
  }
}
