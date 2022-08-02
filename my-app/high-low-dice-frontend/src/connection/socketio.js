/* eslint-disable import/no-anonymous-default-export */
// need to disable eslint, otherwise useDispatch show error
import React, { createContext } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {
  addNewPlayer,
  resetPlayerStats,
  newGame,
  collectRoundFees,
  diceRolled,
  playerIsReady,
} from '../redux/actions';

const SocketioContext = createContext(null);

export { SocketioContext };

export default ({ children }) => {
  let socket;
  let socketio;

  const dispatch = useDispatch();

  const newPlayer = (roomId, username) => {
    const payload = {
      roomId: roomId,
      playerName: username,
    };
    socket.emit('event://send-newplayer', JSON.stringify(payload));
  };

  const startNewGame = roomId => {
    const payload = { roomId: roomId };
    socket.emit('event://send-newgame', JSON.stringify(payload));
  };

  const rollDice = (roomId, round, turn, rolls) => {
    const payload = { roomId: roomId, round: round, id: turn, rolls: rolls };
    socket.emit('event://send-rolldice', JSON.stringify(payload));
  };

  const playerReady = (roomId, userId) => {
    const payload = {
      roomId: roomId,
      playerId: userId,
    };
    socket.emit('event://send-playerready', JSON.stringify(payload));
  };

  if (!socket) {
    socket = io.connect(process.env.REACT_APP_SOCKETIO_URL, {
      path: process.env.REACT_APP_SOCKETIO_PATH,
    });

    socket.on('connect', () => {
      console.log('Connected socket.id', socket.id);
    });

    socket.on('welcome to server', msg => {
      console.log(msg);
    });

    socket.on('player logged in', () => {
      console.log('player logged in');
    });

    socket.on('event://get-newplayer', msg => {
      const { roomName, playerName } = msg;
      dispatch(addNewPlayer(roomName, playerName));
    });

    socket.on('event://get-newgame', msg => {
      const { roomName } = msg;
      dispatch(resetPlayerStats(roomName));
      dispatch(newGame(roomName));
      dispatch(collectRoundFees(roomName));
    });

    socket.on('event://get-rolldice', msg => {
      const { roomName, dice, round, id, rolls } = msg;
      dispatch(diceRolled(roomName, dice, round, id, rolls));
    });

    socket.on('event://get-playerready', msg => {
      const { roomName, playerId } = msg;
      dispatch(playerIsReady(roomName, playerId));
    });

    socketio = {
      socket: socket,
      newPlayer,
      startNewGame,
      rollDice,
      playerReady,
    };
  }

  return (
    <SocketioContext.Provider value={socketio}>
      {children}
    </SocketioContext.Provider>
  );
};
