import { FaUserCircle } from 'react-icons/fa';
import React, { Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import styles from './login-component.less';
import { AuthInformation, AuthClient } from '../auth/auth-client';
import { JSonRpcResult, JSonRpcMessage } from '../rpc/rpc-messages';
import { ClientLibrary } from '../rpc/client-library';
import Store from 'electron-store';

interface LoginComponentState {
    showMenu: boolean;
    userName: string;
    error: string;
}

export interface LoginComponentProps {
    authCallBack: (state: AuthInformation) => void;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {
    server: any;
    constructor(props: LoginComponentProps, state: LoginComponentState) {
        super(props, state);

        this.state = {
            showMenu: false,
            userName: '',
            error: ''
        };

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    componentDidMount() {
        const store = new Store();
        const creds = store.get('credentials');
        if (creds) {
            this.login(creds.password, creds.account);
        }
    }

    login = async (password: string, email: string) => {
        const store = new Store();
        if (email && password) {
            let authclient = new AuthClient(email, password, 'fr-FR', 'http://127.0.0.1', '/api/v1/auth/thin/sessions', 5000);
            let authInfo = await authclient.getSessionToken();
            if (authInfo && (authInfo as AuthInformation).token) {
                this.props.authCallBack(authInfo as AuthInformation);
                store.set('credentials', { account: email, password: password });
                if (this.server) {
                    this.server.close();
                }
                this.startPipe(authInfo as AuthInformation);
                this.setState({ showMenu: false, userName: email, error: '' });
            } else {
                this.setState({ showMenu: true, userName: '', error: (authInfo as any).error });
            }
        }
    }

    startPipe = (state: AuthInformation) => {
        const clientLibrary = new ClientLibrary('http://127.0.0.1', '/api/v1/auth/thin/codes', 5000, state);

        let net = require('net');
        let PIPE_NAME = 'GameforgeClientJSONRPCMS2';
        let PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME;

        if (state.platformGameAccountId === '' || state.token === '') {
            console.log('invalid account');
            return;
        }

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

    showMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        this.setState({ showMenu: !this.state.showMenu, userName: this.state.userName, error: '' });
    }

    closeMenu = () => {
        this.setState({ showMenu: false, userName: this.state.userName, error: '' });
    }

    logout = () => {
        this.setState({ showMenu: false, userName: '', error: '' });
        this.props.authCallBack({ platformGameAccountId: '', token: '', user: '' });
        this.server.close();
    }

    loginForm = (event: any) => {
        event.preventDefault();
        let password = (document.getElementById('password') as HTMLInputElement).value;
        let email = (document.getElementById('email') as HTMLInputElement).value;
        this.login(password, email);
    }

    render() {
        const { userName } = this.state;
        return (<Fragment>
            <span className={styles.login}>
                <FaUserCircle onClick={this.showMenu} className={`${userName !== '' ? styles.online : ''} ${styles.loginLogo}`} />
                {userName !== '' ? <div className={styles.userId}>{userName || ''}</div> : ''}
            </span>
            {userName === '' ? <Modal className={styles.loginMenu} show={this.state.showMenu} centered onHide={this.closeMenu}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.loginForm}>
                        {this.state.error !== '' && <div className='alert alert-danger'>{this.state.error}</div>}
                        <Form.Group>
                            <Form.Label>Login/Email address</Form.Label>
                            <Form.Control id='email' type='text' placeholder='Enter Login/Email' required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control id='password' type='password' placeholder='Password' required />
                        </Form.Group>
                        <Button variant='primary' className={styles.loginButton} type='submit'>
                            Log In
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal> : this.state.showMenu && <div>
                <div className={styles.logoutMenu}>
                    <Button variant='link' onClick={this.logout}>Logout</Button>
                </div>
            </div>}
        </Fragment>
        );
    }
}

