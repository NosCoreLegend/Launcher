import { FaUserCircle } from 'react-icons/fa';
import React, { Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './login-component.css';

interface LoginComponentProps {

}

interface LoginComponentState {
    showMenu: boolean;
    userName: string;
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

        this.setState({ showMenu: true });
    }

    closeMenu() {
        this.setState({ showMenu: false });
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
                        <Form>
                            <Form.Group controlId='formGroupEmail'>
                                <Form.Label>Login/Email address</Form.Label>
                                <Form.Control type='email' placeholder='Enter Login/Email' />
                            </Form.Group>
                            <Form.Group controlId='formGroupPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' placeholder='Password' />
                            </Form.Group>
                        </Form>

                        <Button variant='primary' className='loginButton'>
                            Log In
                        </Button>
                    </Modal.Body>
                </Modal>

            }
        </Fragment>
        );
    }
}
