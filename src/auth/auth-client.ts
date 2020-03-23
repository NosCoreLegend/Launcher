import request from "request";
import { Guid } from "guid-typescript";

export interface AuthInformation {
  platformGameAccountId: string;
  token: string;
  user: string;
}

export class AuthClient {
  user: string;
  password: string;
  language: string;
  url: string;
  port: number;
  path: string;
  code: string;
  installationId: string;

  constructor(
    user: string,
    password: string,
    language: string,
    url: string,
    path: string,
    port: number
  ) {
    this.user = user;
    this.password = password;
    this.language = language;
    this.url = url;
    this.port = port;
    this.path = path;
    this.code = "";
    this.installationId = "";
  }

  getSessionToken = async () => {
    return new Promise((resolve, reject) => {
      process.env["_TNT_SESSION_ID"] = Guid.create().toString();
      process.env["_TNT_CLIENT_APPLICATION_ID"] =
        "d3b2a0c1-f0d0-4888-ae0b-1c5e1febdafb";

      const data = {
        gfLang: this.language.substring(0, 2),
        identity: this.user,
        locale: this.language,
        password: this.password,
        platformGameId: "dd4e22d6-00d1-44b9-8126-d8b40e0cd7c9"
      };

      const options = {
        url: this.url + ":" + this.port + this.path,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(data))
        },
        json: data
      };

      request.post(options, (err: any, res: any, body: any) => {
        if (body) {
          if (body.token && body.platformGameAccountId) {
            resolve({
              user: this.user,
              token: body.token,
              platformGameAccountId: body.platformGameAccountId
            });
          } else {
            resolve({ error: body.toString() });
          }
        } else if (err) {
          resolve({
            error:
              "Something went wrong while trying communicate with the server. The server may be down."
          });
        }
      });
    });
  };
}
