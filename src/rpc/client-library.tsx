import request from 'request';
import { AuthInformation } from '../auth/auth-client';

export class ClientLibrary {
  url: string;
  authInfo: AuthInformation;
  port: number;
  path: string;
  code: string;
  installationId: string;

  constructor(url: string, path: string, port: number, authInfo: AuthInformation) {
    this.url = url;
    this.authInfo = authInfo;
    this.port = port;
    this.path = path;
    this.code = '';
    this.installationId = '';
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

      const data = {
        PlatformGameAccountId: this.authInfo.platformGameAccountId
      };

      const options = {
        url: this.url + ':' + this.port + this.path,
        headers: {
          'TNT-Installation-Id': this.installationId,
          'User-Agent': 'TNTClientMS2/1.3.39',
          'Authorization': `Bearer ${this.authInfo.token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data))
        },
        json: data
      };

      request.post(options, (err: any, res: any, body: any) => {
        if (body) {
          this.code = body.code;
          resolve(body);
        } else if (err) {
          reject(err);
        }
      });
    });
  }

  QueryGameAccountName = (sessionId: string) => {
    return this.authInfo.user;
  }

  QueryAuthorizationCode = async (sessionId: string) => {
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
