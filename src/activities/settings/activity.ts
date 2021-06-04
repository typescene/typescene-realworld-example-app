import { component, PageViewActivity, service, UIFormContext } from "typescene";
import { UserService } from "../../services/User";
import view from "./view";

/** Settings page activity */
export class SettingsActivity extends PageViewActivity.with(view) {
  path = "/settings";
  name = "Settings";

  @service("App.User")
  userService!: UserService;

  /** Current user form fields */
  @component
  formContext?: UIFormContext;

  async onManagedStateActivatingAsync() {
    await this.userService.loadAsync();

    // navigate away if the user is not logged in
    let user = this.userService.profile;
    if (!user) {
      this.getApplication()!.navigate("/");
      throw Error("Not logged in");
    }

    // update input form with profile data
    this.formContext = UIFormContext.create({
      image: user.image || "",
      username: user.username,
      bio: user.bio || "",
      email: user.email,
    });
  }

  /** Event handler: submit profile record */
  async onSubmit() {
    try {
      // call the API and navigate back to the user's own profile
      await this.userService.saveProfileAsync({
        ...this.formContext!.serialize(),
      });
      this.getApplication()!.navigate(
        "/profile/" + this.userService.profile!.username
      );
    } catch (err) {
      this.showConfirmationDialogAsync(String(err.message));
    }
  }

  /** Event handler: log out and navigate away */
  onLogout() {
    this.userService.logout();
    this.getApplication()!.navigate("/");
  }
}

SettingsActivity.autoUpdate(module);
