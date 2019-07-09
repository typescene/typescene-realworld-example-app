import { BrowserApplication } from "@typescene/webapp";
import { ArticleActivity } from "./activities/article/activity";
import { EditorActivity } from "./activities/editor/activity";
import { HomeActivity } from "./activities/home/activity";
import { LoginActivity } from "./activities/login/activity";
import { ProfileActivity } from "./activities/profile/activity";
import { RegisterActivity } from "./activities/register/activity";
import { SettingsActivity } from "./activities/settings/activity";
import { ArticlesService } from "./services/Articles";
import { DefaultI18nService } from "./services/I18n";
import { RemoteService } from "./services/Remote";
import { TagsService } from "./services/Tags";
import { UserService } from "./services/User";
import "./theme";

export const FEED_LIMIT = 10;

// register all services
new RemoteService().register();
new UserService().register();
new ArticlesService().register();
new TagsService().register();
new DefaultI18nService().register();

// add all activities
BrowserApplication.run(
    HomeActivity,
    LoginActivity,
    RegisterActivity,
    ProfileActivity,
    SettingsActivity,
    EditorActivity,
    ArticleActivity,
    // ... add activities here
);
