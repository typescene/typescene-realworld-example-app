import { PageViewActivity, service, UIFormContext } from "typescene";
import { UserService } from "../../services/User";
import view from "./view";

/** Login page activity */
export class LoginActivity extends PageViewActivity.with(view) {
    path = "/login";

    @service("App.User")
    userService!: UserService;

    /** Input form record, bound to the form displayed */
    inputForm = UIFormContext.create({
        email: "",
        password: "",
    })
        .required("email")
        .required("password");

    /** True if currently trying to log in */
    loading = false;

    /** Event handler: attempt login */
    async doLogin() {
        this.inputForm.validateAll();
        if (!this.inputForm.valid) return;
        this.loading = true;
        try {
            // call the API and navigate home if successful
            await this.userService.loginAsync(this.inputForm.get("email")!, this.inputForm.get("password")!);
            this.getApplication()!.navigate("/");
        } catch (err) {
            this.showConfirmationDialogAsync(err.message);
        }
        this.loading = false;
    }
}
