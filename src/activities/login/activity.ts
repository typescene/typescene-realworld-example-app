import { ManagedRecord, PageViewActivity, service } from "typescene";
import { UserService } from "../../services/User";
import view from "./view";

/** Login page activity */
export class LoginActivity extends PageViewActivity.with(view) {
    path = "/login";

    @service("App.User")
    userService!: UserService;

    /** Input form record, bound to the form displayed */
    inputForm = ManagedRecord.create({
        email: "",
        password: ""
    });

    /** True if currently trying to log in */
    loading = false;

    /** Event handler: attempt login */
    async doLogin() {
        if (!this.inputForm.email ||
            !this.inputForm.password ||
            this.loading) {
            return;
        }
        this.loading = true;
        try {
            // call the API and navigate home if successful
            await this.userService.loginAsync(
                this.inputForm.email, this.inputForm.password);
            this.getApplication()!.navigate("/");
        }
        catch (err) {
            this.showConfirmationDialogAsync(err.message);
        }
        this.loading = false;
    }
}