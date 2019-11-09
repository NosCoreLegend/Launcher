import { FaUserCircle } from 'react-icons/fa';
import React, { Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './login-component.css';
import { AuthInformation, AuthClient } from '../auth/auth-client';


interface LoginComponentState {
    showMenu: boolean;
    userName: string;
}

export interface LoginComponentProps {
    authCallBack: (state: AuthInformation) => void;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {
    constructor(props: LoginComponentProps, state: LoginComponentState) {
        super(props, state);

        this.state = {
            showMenu: false,
            userName: ''
        };

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu = (event: React.MouseEvent) => {
        event.preventDefault();

        this.setState({ showMenu: true, userName: this.state.userName });
    }

    closeMenu() {
        this.setState({ showMenu: false, userName: this.state.userName, });
    }

    login = async (event: any) => {
        event.preventDefault();
        let password = (document.getElementById('password') as HTMLInputElement).value;
        let email = (document.getElementById('email') as HTMLInputElement).value;
        if (email && password) {
            let authclient = new AuthClient(email, password, 'fr-FR', 'localhost', '/api/v1/auth/thin', 5000);
            let authInfo = await authclient.getSessionToken() as AuthInformation;
            if (authInfo) {
                this.props.authCallBack(authInfo);
                this.setState({ showMenu: false, userName: email });
            }
        }
    }

    render() {
        const { userName } = this.state;
        return (<Fragment>
            <span className='status login'>
                <FaUserCircle onClick={this.showMenu} className='loginLogo' />
                {userName !== '' ? <div className='userId'>{userName || ''}</div> : ''}
            </span>
            {
                <Modal className='loginMenu' show={this.state.showMenu} centered onHide={this.closeMenu}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.login}>
                            <Form.Group>
                                <Form.Label>Login/Email address</Form.Label>
                                <Form.Control id='email' type='text' placeholder='Enter Login/Email' required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control id='password' type='password' placeholder='Password' required />
                            </Form.Group>
                            <Button variant='primary' className='loginButton' type='submit'>
                                Log In
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

            }
        </Fragment>
        );
    }
}
