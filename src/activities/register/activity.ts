import { component, PageViewActivity, service, UIFormContext } from "typescene";
import { UserService } from "../../services/User";
import view from "./view";

/** Registration page activity */
export class RegisterActivity extends PageViewActivity.with(view) {
  path = "/register";

  @service("App.User")
  userService!: UserService;

  /** Input form fields */
  @component()
  formContext = UIFormContext.create({
    username: "",
    email: "",
    password: "",
  })
    .required("username")
    .required("email")
    .required("password");

  /** True if the registration data is currently being sent */
  loading = false;

  async onManagedStateActivatingAsync() {
    await this.userService.loadAsync();

    // navigate away if the user is already logged in
    if (this.userService.isLoggedIn) {
      this.getApplication()!.navigate("/");
      throw Error("Already logged in");
    }
  }

  /** Event handler: submit registration data */
  async onTryRegister() {
    if (this.loading) return;
    this.formContext.validateAll();
    if (!this.formContext.valid) return;

    this.loading = true;
    try {
      // call the API and navigate away
      await this.userService.registerAsync(
        this.formContext.get("username")!,
        this.formContext.get("email")!,
        this.formContext.get("password")!
      );
      this.getApplication()!.navigate("/");
    } catch (err) {
      this.showConfirmationDialogAsync(err.message);
    }
    this.loading = false;
  }
}

RegisterActivity.autoUpdate(module);
