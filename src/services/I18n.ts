import { I18nService } from "typescene";

/** Dummy i18n service, only implements 'date' conversion */
export class DefaultI18nService extends I18nService {
  locale = "en-US";

  format(value: any, type: string): string {
    if (type === "date") {
      let dd = value instanceof Date ? value : new Date(value);
      return dd.toDateString();
    }
    return value;
  }
}
