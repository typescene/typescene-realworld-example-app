import { ManagedRecord, PageViewActivity, service } from "typescene";
import { UserService } from "../../services/User";
import view from "./view";

/** Registration page activity */
export class RegisterActivity extends PageViewActivity.with(view) {
    path = "/register";

    @service("App.User")
    userService!: UserService;

    /** Input form record */
    inputForm = ManagedRecord.create({
        username: "",
        email: "",
        password: ""
    });

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
    async doRegister() {
        if (!this.inputForm.username ||
            !this.inputForm.email ||
            !this.inputForm.password ||
            this.loading) {
            return;
        }
        this.loading = true;
        try {
            // call the API and navigate away
            await this.userService.registerAsync(
                this.inputForm.username,
                this.inputForm.email,
                this.inputForm.password);
            this.getApplication()!.navigate("/");
        }
        catch (err) {
            this.showConfirmationDialogAsync(err.message);
        }
        this.loading = false;
    }
}