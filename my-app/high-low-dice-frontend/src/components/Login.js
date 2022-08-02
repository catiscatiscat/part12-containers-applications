import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { createRoom, joinRoom } from '../redux/actions';
import { SocketioContext } from '../connection/socketio';
import Container from 'react-bootstrap/Container';
import { BsInfoCircle } from 'react-icons/bs';

import { HLDButton } from './Buttons';
import ErrorNotification from './ErrorNotification';
import IconWithTooltip from './IconWithTooltip';

const Login = () => {
  const [username, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');

  const dispatch = useDispatch();
  const io = useContext(SocketioContext);

  const createGameRoom = (roomName, username) => {
    dispatch(createRoom(roomName, username));
  };
  const joinGameRoom = (roomId, username) => {
    dispatch(joinRoom(roomId, username));
    io.newPlayer(roomId, username);
  };

  return (
    <Container fluid={false} className='loginContainer'>
      <form>
        <fieldset className='loginSet'>
          <div className='loginGroup'>
            <input
              type='text'
              placeholder='Player name required'
              value={username}
              onChange={e => setUserName(e.target.value)}
            />
          </div>
          <div className='loginGroup'>
            <span>
              Create a new room
              <IconWithTooltip
                tooltip='...and invite players by sending roomId'
                placement='right'
                size='1em'
                marginLeft='0.5em'
              >
                <BsInfoCircle />
              </IconWithTooltip>
            </span>
            <div className='aling-buttons'>
              <input
                type='text'
                placeholder='Room name'
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
              />
              <HLDButton
                title='Create'
                className='login-button'
                disabled={!username || !roomName}
                handleClick={() => createGameRoom(roomName, username)}
              />
            </div>
          </div>
          <div className='loginGroup'>
            <span>
              Join an existing room{' '}
              <IconWithTooltip
                tooltip='Get a room Id from the creator of the room'
                placement='right'
                size='1em'
                marginRight='0.5em'
              >
                <BsInfoCircle />
              </IconWithTooltip>
            </span>
            <div className='aling-buttons'>
              <input
                type='text'
                placeholder='Room Id'
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              />
              <HLDButton
                title='Join'
                className='login-button'
                disabled={!username || !roomId}
                handleClick={() => joinGameRoom(roomId, username)}
              />
            </div>
          </div>
          <div>
            <ErrorNotification />
          </div>
        </fieldset>
      </form>
    </Container>
  );
};

export default Login;
