import React from 'react';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './left-panel.css';
import { JSonRpcResult, JSonRpcMessage } from '../rpc/rpc-messages';
import { ClientLibrary } from '../rpc/client-library';
import { AuthInformation } from '../auth/auth-client';

const nosDirectory = 'C:\\Program Files (x86)\\NosTale\\';

export class LeftPanel extends React.Component<AuthInformation, {}> {

  server: any;
  componentDidMount() {
    this.startPipe();
  }

  componentWillUnmount() {
    if (this.server) {
      this.server.close();
    }
  }

  startPipe = () => {
    let clientLibrary = new ClientLibrary('localhost', '/api/v1/auth/thin', 5000, this.props);

    let net = require('net');
    let PIPE_NAME = 'GameforgeClientJSONRPCMS2';
    let PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME;

    this.server = net.createServer(function (stream: any) {
      stream.on('data', async (data: any) => {
        console.log('New packet received', String.fromCharCode.apply(null, data));
        const obj = JSON.parse(String.fromCharCode.apply(null, data)) as JSonRpcMessage;
        let returnMessage = {
          id: obj.id,
          jsonrpc: obj.jsonrpc,
          result: ''
        } as JSonRpcResult;
        console.log(obj.params);
        switch (obj.method) {
          case 'ClientLibrary.isClientRunning':
            returnMessage.result = clientLibrary.IsClientRunning(obj.params.sessionId);
            break;
          case 'ClientLibrary.initSession':
            returnMessage.result = clientLibrary.InitSession(obj.params.sessionId);
            break;
          case 'ClientLibrary.queryAuthorizationCode':
            returnMessage.result = await clientLibrary.QueryAuthorizationCode(obj.params.sessionId);
            break;
          case 'ClientLibrary.queryGameAccountName':
            returnMessage.result = clientLibrary.QueryGameAccountName(obj.params.sessionId);
            break;
        }
        stream.write(JSON.stringify(returnMessage));
        console.log('New packet sent', JSON.stringify(returnMessage));
      });
    });

    this.server.listen(PIPE_PATH);
  }

  startNostale = () => {
    const executablePath = `${nosDirectory}NosCore.exe`;
    const fs = require('fs');

    const parameters = ['gf'];
    const ip = '127.0.0.1';
    const port = 4002;

    fs.readFile(`${nosDirectory}NostaleClientX.exe`, 'binary', function (err: any, data: any) {
      if (err) {
        return console.log(err);
      }
      let result = data;

      // change port
      const portRegexp = new RegExp(`${String.fromCharCode(0)}[${String.fromCharCode(160)}-${String.fromCharCode(169)}]${String.fromCharCode(15)}${String.fromCharCode(0)}`, 'g');
      result = result.replace(portRegexp, String.fromCharCode(0) + String.fromCharCode(Number('0x' + port.toString(16).substr(1, 2))) + String.fromCharCode(Number('0x0' + port.toString(16).substr(0, 1))) + String.fromCharCode(0));

      // change ip
      const endOfIp = String.fromCharCode(0) + String.fromCharCode(255).repeat(4);
      const reg = /\d{2,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
      let ipToReplace;

      // tslint:disable-next-line: no-conditional-assignment
      while ((ipToReplace = reg.exec(result)) !== null) {
        const lengthDiff = 15 - ipToReplace.toString().length;
        const re = new RegExp(ipToReplace.toString() + String.fromCharCode(0).repeat(lengthDiff) + endOfIp + '.', 'g');
        result = result.toString().replace(re, ip + String.fromCharCode(0).repeat(15 - ip.length) + String.fromCharCode(0) + String.fromCharCode(255).repeat(4) + String.fromCharCode(ip.length));
      }

      if (fs.existsSync(executablePath)) {
        fs.unlinkSync(executablePath);
      }

      fs.writeFile(executablePath, result, 'binary', function (err: any) {
        if (err) return console.log(err);
      });
    });

    console.log(this.props.user);
    require('child_process').execFile(executablePath, parameters);
  }

  render() {
    return (
      <div className='leftPanel'>
        <h1>Noscore Legend</h1>
        <p>
          NosCore Legend is a Nostale private server running on NosCoreIO. This server is meant to be used for testing the NosCore emulator.
                </p>
        <nav className='leftNavBar'>
          Website | Discord | Support | Terms of Use
                </nav>
        <Button onClick={this.startNostale} className='playButton btn-lg' variant='primary'>
          Play
                </Button>
        {/* <ProgressBar className="progressBar" now={20} label={`20%`} /> */}
      </div>
    );
  }
}
