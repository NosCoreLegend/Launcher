import http from 'http';
import { Guid } from 'guid-typescript';

export class ClientLibrary {
  user: string;
  password: string;
  language: string;
  url: string;
  platformGameAccountId: string;
  token: string;
  port: number;
  path: string;
  code: string;
  installationId: string;

  constructor(user: string, password: string, language: string, url: string, path: string, port: number) {
    this.user = user;
    this.password = password;
    this.language = language;
    this.url = url;
    this.platformGameAccountId = '';
    this.token = '';
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
          const obj = JSON.parse(res);
          this.token = obj.token;
          this.platformGameAccountId = obj.platformGameAccountId;
          resolve(res);
        });

        req.on('error', err => {
          reject(err);
        });
      });

      req.write(data);
      req.end();
    });
  }

  getAuthorizationCode = async () => {
    return new Promise((resolve, reject) => {
      let Registry = require('winreg');
      let regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Gameforge4d\\TNTClient\\MainApp'
      });
      regKey.values((err: any, items: any) => {
        if (err) {
          console.log('ERROR: ' + err);
        } else {
          for (let i = 0; i < items.length; i++) {
            if (items[i].name === 'InstallationId') {
              this.installationId = items[i].value;
            }
          }
        }
      });

      const data = JSON.stringify({
        PlatformGameAccountId: this.platformGameAccountId
      });

      const options = {
        hostname: this.url,
        port: this.port,
        path: this.path + '/codes',
        method: 'POST',
        headers: {
          'TNT-Installation-Id': this.installationId,
          'User-Agent': 'TNTClientMS2/1.3.39',
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = http.request(options, (res) => {
        res.on('data', (res) => {
          const obj = JSON.parse(res);
          this.code = obj.code;
          resolve(res);
        });

        req.on('error', err => {
          reject(err);
        });
      });

      req.write(data);
      req.end();
    });
  }

  QueryGameAccountName = (sessionId: string) => {
    return this.user;
  }

  QueryAuthorizationCode = async (sessionId: string) => {
    if (this.token === '') {
      await this.getSessionToken();
    }
    await this.getAuthorizationCode();
    return this.code;
  }

  InitSession = (sessionId: string) => {
    return sessionId;
  }

  IsClientRunning = (sessionId: string) => {
    return true;
  }
}
