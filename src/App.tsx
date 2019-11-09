import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { MenuBar } from './menu-bar/menu-bar';
import { LeftPanel } from './left-panel/left-panel';
import { NewsPanel } from './news-panel/news-panel';

const App: React.FC = () => {
  return (
    <div className='App'>
      <MenuBar />
      <div className='container'>
        <div className='row'>
          <div className='row'>
            <div className='col-7'> <LeftPanel /></div>
            <div className='col-5'><NewsPanel /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
