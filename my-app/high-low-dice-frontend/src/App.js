import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import SocketioProvider from './connection/socketio';
import 'bootstrap/dist/css/bootstrap.min.css';

import Main from './components/Main';

import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <SocketioProvider>
        <Main />
      </SocketioProvider>
    </Provider>
  );
};

export default App;
