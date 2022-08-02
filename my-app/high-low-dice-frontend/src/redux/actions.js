import axios from 'axios';

import {
  CREATE_ROOM_REQUEST,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_ERROR,
  JOIN_ROOM_REQUEST,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  ADD_PLAYER,
  ADD_NEW_PLAYER,
  RESET_PLAYER_STATS,
  COLLECT_ROUND_FEES,
  PAY_ROUND_WINNINGS,
  NEW_GAME,
  NEXT_ROUND,
  NEXT_PLAYER,
  INCREMENT_ROLLS,
  UPDATE_ROUND_LOW,
  UPDATE_ROUND_HIGH,
  WAITING_PLAYERS,
  PLAYER_READY,
  ROLL_DICE,
  HIDE_ERROR,
} from './actionTypes';

// ***** room state actions *****

export const createRoomRequest = () => ({
  type: CREATE_ROOM_REQUEST,
});

export const createRoomSuccess = payload => ({
  type: CREATE_ROOM_SUCCESS,
  data: payload,
  error: null,
});

export const createRoomError = error => ({
  type: CREATE_ROOM_ERROR,
  data: null,
  error: error,
});

export const createRoom = (roomName, username) => {
  return async function (dispatch) {
    dispatch(createRoomRequest());
    try {
      const response = (
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/room?name=${roomName}&user=${username}`
        )
      ).data;
      if (response.status === 'ok') {
        const playerlist = response.data.playerlist;
        dispatch(createRoomSuccess(response.data));
        playerlist.forEach(player => {
          dispatch(addPlayer(player));
        });
      } else {
        dispatch(createRoomError(response.error));
      }
    } catch (error) {
      dispatch(createRoomError(error));
    }
  };
};

export const joinRoomRequest = () => ({
  type: JOIN_ROOM_REQUEST,
});

export const joinRoomSuccess = payload => ({
  type: JOIN_ROOM_SUCCESS,
  data: payload,
  error: null,
});

export const joinRoomError = error => ({
  type: JOIN_ROOM_ERROR,
  data: null,
  error: error,
});

export const joinRoom = (roomId, username) => {
  return async function (dispatch) {
    dispatch(joinRoomRequest());
    try {
      const response = (
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/room/${roomId}?user=${username}`
        )
      ).data;
      if (response.status === 'ok') {
        const playerlist = response.data.playerlist;
        dispatch(joinRoomSuccess(response.data));
        playerlist.forEach(player => {
          dispatch(addPlayer(player));
        });
      } else {
        dispatch(joinRoomError(response.error));
      }
    } catch (error) {
      dispatch(joinRoomError(error));
    }
  };
};

// ***** players state actions *****

export const addPlayer = user => ({
  type: ADD_PLAYER,
  payload: {
    name: user,
  },
});

export const addNewPlayer = (roomName, playerName) => ({
  type: ADD_NEW_PLAYER,
  payload: {
    roomName: roomName,
    name: playerName,
  },
});

export const resetPlayerStats = roomName => ({
  type: RESET_PLAYER_STATS,
  payload: {
    roomName: roomName,
  },
});

export const collectRoundFees = roomName => ({
  type: COLLECT_ROUND_FEES,
  payload: {
    roomName: roomName,
  },
});

export const payRoundWinnings = (
  roundLow,
  roundHigh,
  roundLowWinnings,
  roundHighWinnings
) => ({
  type: PAY_ROUND_WINNINGS,
  payload: {
    low: roundLow,
    high: roundHigh,
    lowWinnings: roundLowWinnings,
    highWinnings: roundHighWinnings,
  },
});

// ***** game state actions *****

export const newGame = roomName => ({
  type: NEW_GAME,
  payload: {
    roomName: roomName,
  },
});

export const nextRound = () => ({
  type: NEXT_ROUND,
});

export const nextPlayer = () => ({
  type: NEXT_PLAYER,
});

export const incrementRolls = () => ({
  type: INCREMENT_ROLLS,
});

export const updateRoundLow = (round, newLow) => ({
  type: UPDATE_ROUND_LOW,
  payload: { round, newLow },
});

export const updateRoundHigh = (round, newHigh) => ({
  type: UPDATE_ROUND_HIGH,
  payload: { round, newHigh },
});

export const waitingPlayers = () => ({
  type: WAITING_PLAYERS,
});

export const playerIsReady = (roomName, playerId) => ({
  type: PLAYER_READY,
  payload: {
    roomName: roomName,
    playerId: playerId,
  },
});

// ***** dice state actions *****

export const diceRolled = (roomName, dice, round, id, rolls) => ({
  type: ROLL_DICE,
  payload: {
    roomName: roomName,
    dice: dice,
    round: round,
    id: id,
    rolls: rolls,
  },
});

// ***** error state actions *****

export const hideError = () => ({
  type: HIDE_ERROR,
});
