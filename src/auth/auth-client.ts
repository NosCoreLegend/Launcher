import http from 'http';
import { Guid } from 'guid-typescript';

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

  constructor(user: string, password: string, language: string, url: string, path: string, port: number) {
    this.user = user;
    this.password = password;
    this.language = language;
    this.url = url;
    this.port = port;
    this.path = path;
    this.code = '';
    this.installationId = '';
  }

  getSessionToken = async () => {
    return new Promise((resolve, reject) => {
      process.env['_TNT_SESSION_ID'] = Guid.create().toString();

      const data = JSON.stringify({
        gfLang: this.language.substring(0, 2),
        identity: this.user,
        locale: this.language,
        password: this.password,
        platformGameId: 'dd4e22d6-00d1-44b9-8126-d8b40e0cd7c9'
      });

      const options = {
        hostname: this.url,
        port: this.port,
        path: this.path + '/sessions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = http.request(options, (res) => {
        res.on('data', (res) => {
          let obj;
          try {
            obj = JSON.parse(res);
          } catch {
            obj = res.toString();
          }
       
          if (obj.token && obj.platformGameAccountId) {
            resolve({ user: this.user, token: obj.token, platformGameAccountId: obj.platformGameAccountId });
          } else {
            resolve({ error: res.toString() });
          }
        });
      });

      req.on('error', err => {
        resolve({ error: 'Something went wrong while trying communicate with the server. The server may be down.'});
      });

      req.write(data);
      req.end();
    });
  }
}
