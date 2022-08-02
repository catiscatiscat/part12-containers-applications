import React from 'react';
import { useSelector } from 'react-redux';

import TopBar from './TopBar';
import Login from './Login';
import Players from './Players';
import Round from './Round';

const Main = () => {
  const currentRoom = useSelector(state => state.room.roomName);
  return (
    <>
      <TopBar />
      {!currentRoom && <Login />}
      {currentRoom && (
        <>
          <Players />
          <Round />
        </>
      )}
    </>
  );
};

export default Main;
