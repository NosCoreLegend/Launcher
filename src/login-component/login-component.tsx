import { FaUserCircle } from 'react-icons/fa';
import React, { Fragment } from 'react';
export class LoginComponent extends React.Component<{}, {}> {

  render() {
    return (<Fragment>
            <li className='loginLogo'>
                <FaUserCircle />
            </li>
            <li className='status'>
                <div className='userId'>0Lucifer0</div>
            </li>
        </Fragment>
    );
  }
}
