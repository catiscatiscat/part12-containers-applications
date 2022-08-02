export const getRoom = store => store.room;

export const getPlayersState = store => store.players;

export const getPlayerList = store =>
  getPlayersState(store) ? getPlayersState(store).allIds : [];

export const getPlayerById = (store, id) =>
  getPlayersState(store) ? { ...getPlayersState(store).byIds[id], id } : {};

export const getPlayers = store =>
  getPlayerList(store).map(id => getPlayerById(store, id));

export const getRoundRolls = (store, round) => {
  const players = getPlayers(store);
  const playersRolls = players.map(player => player.rolls);
  const roundRolls = playersRolls
    .map(rolls => rolls[round - 1])
    .filter(roll => roll > 0);
  return roundRolls;
};

export const getRoundLow = (store, round) =>
  Math.min.apply(null, getRoundRolls(store, round)) !== Infinity
    ? Math.min.apply(null, getRoundRolls(store, round))
    : 0;

export const getRoundHigh = (store, round) =>
  Math.max.apply(null, getRoundRolls(store, round)) !== -Infinity
    ? Math.max.apply(null, getRoundRolls(store, round))
    : 0;

export const getGame = store => store.game;

export const getRound = store => store.game.round;

export const getRolls = store => store.game.rolls;

export const getRoundLows = store => store.game.roundLows;

export const getRoundHighs = store => store.game.roundHighs;

export const getRoundLowCount = (store, round) => {
  const lows = getRoundRolls(store, round).filter(
    value => value === getRoundLows(store)[round - 1]
  );
  return lows.length;
};

export const getRoundHighCount = (store, round) => {
  const highs = getRoundRolls(store, round).filter(
    value => value === getRoundHighs(store)[round - 1]
  );
  return highs.length;
};

export const getRoundLowWinnings = (store, round) =>
  getPlayerList(store).length / 2 / getRoundLowCount(store, round);

export const getRoundHighWinnings = (store, round) =>
  getPlayerList(store).length / 2 / getRoundHighCount(store, round);

export const getDice = store => store.dice;
