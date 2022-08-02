/* eslint-disable import/no-anonymous-default-export */
import _ from 'lodash';
import {
  CREATE_ROOM_SUCCESS,
  JOIN_ROOM_SUCCESS,
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

const initialState = {
  room: {
    roomId: null,
    roomName: null,
    username: null,
  },
  players: { allIds: [], allNames: [], byIds: {} },
  game: {
    gameOn: false,
    round: null,
    turn: null,
    rolls: null,
    roundLows: [0, 0, 0, 0, 0, 0],
    roundHighs: [0, 0, 0, 0, 0, 0],
    waiting: [],
  },
  dice: {
    dice: [
      { value: null, ready: false },
      { value: null, ready: false },
      { value: null, ready: false },
      { value: null, ready: false },
      { value: null, ready: false },
      { value: null, ready: false },
    ],
  },
  error: {
    error: null,
    isOpen: false,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_ROOM_SUCCESS: {
      const { id, name, user } = action.data;
      return {
        ...state,
        room: {
          ...state.room,
          roomId: id,
          roomName: name,
          username: user,
        },
      };
    }
    case JOIN_ROOM_SUCCESS: {
      const { id, name, user } = action.data;
      return {
        ...state,
        room: {
          ...state.room,
          roomId: id,
          roomName: name,
          username: user,
        },
      };
    }
    case ADD_PLAYER: {
      const { name } = action.payload;
      let id = state.players.allIds.length + 1;
      return {
        ...state,
        players: {
          ...state.players,
          allIds: [...state.players.allIds, id],
          allNames: [...state.players.allNames, name],
          byIds: {
            ...state.players.byIds,
            [id]: {
              name,
              score: 0,
              rolls: [],
            },
          },
        },
      };
    }
    case ADD_NEW_PLAYER: {
      const { roomName, name } = action.payload;
      if (
        roomName === state.room.roomName &&
        !_.includes(state.players.allNames, name)
      ) {
        let id = state.players.allIds.length + 1;
        return {
          ...state,
          players: {
            ...state.players,
            allIds: [...state.players.allIds, id],
            allNames: [...state.players.allNames, name],
            byIds: {
              ...state.players.byIds,
              [id]: {
                name,
                score: 0,
                rolls: [],
              },
            },
          },
        };
      } else {
        return state;
      }
    }
    case RESET_PLAYER_STATS: {
      const { roomName } = action.payload;
      if (roomName === state.room.roomName) {
        let byIdsTemp = state.players.byIds;
        for (let id = 1; id <= state.players.allIds.length; id++) {
          byIdsTemp[id].rolls = [];
          byIdsTemp[id].score = 0;
        }
        return {
          ...state,
          players: {
            ...state.players,
            byIds: byIdsTemp,
          },
        };
      } else {
        return state;
      }
    }
    case COLLECT_ROUND_FEES: {
      const { roomName } = action.payload;
      if (roomName === state.room.roomName) {
        let byIdsTemp = state.players.byIds;
        for (let id = 1; id <= state.players.allIds.length; id++) {
          byIdsTemp[id].score = state.players.byIds[id].score - 1;
        }
        return {
          ...state,
          players: {
            ...state.players,
            byIds: byIdsTemp,
          },
        };
      } else {
        return state;
      }
    }
    case PAY_ROUND_WINNINGS: {
      const { low, high, lowWinnings, highWinnings } = action.payload;
      let byIdsTemp = state.players.byIds;
      for (let id = 1; id <= state.players.allIds.length; id++) {
        if (byIdsTemp[id].rolls[state.game.round - 1] === low) {
          byIdsTemp[id].score = state.players.byIds[id].score + lowWinnings;
        }
        if (byIdsTemp[id].rolls[state.game.round - 1] === high) {
          byIdsTemp[id].score = state.players.byIds[id].score + highWinnings;
        }
      }
      return {
        ...state,
        players: {
          ...state.players,
          byIds: byIdsTemp,
        },
      };
    }
    case NEW_GAME: {
      const { roomName } = action.payload;
      if (roomName === state.room.roomName) {
        return {
          ...state,
          game: {
            ...state.game,
            gameOn: true,
            round: 1,
            turn: 1,
            rolls: 0,
            roundLows: [0, 0, 0, 0, 0, 0],
            roundHighs: [0, 0, 0, 0, 0, 0],
          },
        };
      } else {
        return state;
      }
    }
    case NEXT_ROUND: {
      return {
        ...state,
        game: {
          ...state.game,
          round: state.game.round + 1,
          turn: 1,
          rolls: 0,
        },
      };
    }
    case NEXT_PLAYER: {
      return {
        ...state,
        game: {
          ...state.game,
          turn: state.game.turn + 1,
          rolls: 0,
        },
        dice: {
          ...state.dice,
          dice: initialState.dice.dice,
        },
      };
    }
    case INCREMENT_ROLLS: {
      return {
        ...state,
        game: { ...state.game, rolls: state.game.rolls + 1 },
      };
    }
    case UPDATE_ROUND_LOW: {
      const { round, newLow } = action.payload;
      return {
        ...state,
        game: {
          ...state.game,
          roundLows: [
            ...state.game.roundLows.slice(0, round - 1),
            newLow,
            ...state.game.roundLows.slice(round),
          ],
        },
      };
    }
    case UPDATE_ROUND_HIGH: {
      const { round, newHigh } = action.payload;
      return {
        ...state,
        game: {
          ...state.game,
          roundHighs: [
            ...state.game.roundHighs.slice(0, round - 1),
            newHigh,
            ...state.game.roundHighs.slice(round),
          ],
        },
      };
    }
    case WAITING_PLAYERS: {
      return {
        ...state,
        game: { ...state.game, waiting: state.players.allIds },
      };
    }
    case PLAYER_READY: {
      const { roomName, playerId } = action.payload;
      if (roomName === state.room.roomName) {
        return {
          ...state,
          game: {
            ...state.game,
            waiting: state.game.waiting.filter(value => value !== playerId),
          },
        };
      } else {
        return state;
      }
    }
    case ROLL_DICE: {
      const { roomName, dice, round, id, rolls } = action.payload;
      if (roomName === state.room.roomName) {
        let currentDice = state.dice.dice;
        let tempDice = currentDice.map((die, index) => {
          return die.ready === false
            ? {
                value: dice[index],
                ready: dice[index] === state.game.round,
              }
            : { ...state.dice.dice[index] };
        });
        return {
          ...state,
          game: { ...state.game, rolls: rolls + 1 },
          dice: { ...state.dice, dice: tempDice },
          players: {
            ...state.players,
            byIds: {
              ...state.players.byIds,
              [id]: {
                ...state.players.byIds[id],
                rolls: [
                  ...state.players.byIds[id].rolls.slice(0, round - 1),
                  rolls + 1,
                  ...state.players.byIds[id].rolls.slice(round),
                ],
              },
            },
          },
        };
      } else {
        return state;
      }
    }
    default: {
      const { error } = action;
      if (error) {
        return { ...state, error: { error: error, isOpen: true } };
      } else if (action.type === HIDE_ERROR) {
        return { ...state, error: { error: null, isOpen: false } };
      }
      return state;
    }
  }
}
