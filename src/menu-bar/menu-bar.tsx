import React, { Fragment } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';
import './menu-bar.css';
import { LoginComponent, LoginComponentProps } from '../login-component/login-component';

export class MenuBar extends React.Component<LoginComponentProps, {}> {
  handleClose = (e: any) => {
    e.preventDefault();
    window.close();
  }

  render() {
    return (
      <Fragment>
        <nav className='menu' role='navigation'>
          <ul>
            <li><LoginComponent {...this.props} /></li>
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
