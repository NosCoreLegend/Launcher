import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { MenuBar } from './menu-bar/menu-bar';
import { LeftPanel } from './left-panel/left-panel';
import { NewsPanel } from './news-panel/news-panel';
import { AuthInformation } from './auth/auth-client';

class App extends React.Component<{}, AuthInformation> {
  constructor(props: {}) {
    super(props);

    this.state = { token: '', platformGameAccountId: '', user: '' };
  }

  getAuthInfo = (state: AuthInformation) => {
    console.log(state.user);
    this.setState(state);
  }

  render() {
    return (
      <div className='App'>
        <MenuBar authCallBack={this.getAuthInfo.bind(this)} />
        <div className='container'>
          <div className='row'>
            <div className='row'>
              <div className='col-7'> <LeftPanel {...this.state} /></div>
              <div className='col-5'><NewsPanel /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
