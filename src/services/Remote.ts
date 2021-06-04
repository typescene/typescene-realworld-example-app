import { ManagedService } from "typescene";

const API_ROOT = "https://conduit.productionready.io/api";

/** Service to handle low level API calls */
export class RemoteService extends ManagedService {
  name = "App.Remote";

  token?: string;

  async getAsync(path: string) {
    return this._requestAsync("GET", path);
  }

  async deleteAsync(path: string) {
    return this._requestAsync("DELETE", path);
  }

  async postAsync(path: string, data: any) {
    return this._requestAsync("POST", path, data);
  }

  async putAsync(path: string, data: any) {
    return this._requestAsync("PUT", path, data);
  }

  async _requestAsync(method: string, path: string, data?: any) {
    let headers: any = {};
    if (this.token) {
      headers["Authorization"] = "Token " + this.token;
    }

    let body: string | undefined;
    if (data) {
      body = JSON.stringify(data);
      headers["Content-type"] = "application/json";
    }

    let r = await fetch(API_ROOT + "/" + path, { method, headers, body });
    if (r.status !== 200) {
      if (r.status === 422) {
        // parse detailed validation errors, see RealWorld spec
        let json = await r.json();
        let msg = "Validation failed: ";
        for (let key in json.errors) {
          msg += key + " " + json.errors[key].join(", ") + "; ";
        }
        throw new Error(msg.slice(0, -2));
      }

      // handle other errors
      if (r.status === 404) throw Error("Resource not found");
      if (r.status === 401) throw Error("Authentication failed");
      if (r.status === 403) throw Error("Authorization required");
      throw new Error("An error occurred");
    }
    return await r.json();
  }
}
