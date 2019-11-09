import React, { Fragment } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';
import './menu-bar.css';
import { JSonRpcResult, JSonRpcMessage } from '../rpc/rpc-messages';
import { ClientLibrary } from '../rpc/client-library';
import { LoginComponent } from '../login-component/login-component';

export class MenuBar extends React.Component {
  handleClose = (e: any) => {
    e.preventDefault();
    window.close();
  }

  startPipe = () => {
    let clientLibrary = new ClientLibrary('admin', 'test', 'fr-FR', 'localhost', '/api/v1/auth/thin', 5000);

    let net = require('net');
    let PIPE_NAME = 'GameforgeClientJSONRPCMS2';
    let PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME;

    let server = net.createServer(function (stream: any) {
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

    server.listen(PIPE_PATH);
  }

  componentDidMount() {
    this.startPipe();
  }

  render() {
    return (
            <Fragment>
                <nav className='menu' role='navigation'>
                    <ul>
                       <li><LoginComponent /></li>
                        <li className='closeLogo'>
                            <FaTimes onClick={this.handleClose} />
                        </li>
                        <li className='optionLogo'>
                            <FaCog />
                        </li>
                    </ul>
                </nav>
            </Fragment>
    );
  }
}
