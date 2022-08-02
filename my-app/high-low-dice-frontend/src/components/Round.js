import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { SocketioContext } from '../connection/socketio';
import Container from 'react-bootstrap/Container';
import _ from 'lodash';

import {
  nextRound,
  collectRoundFees,
  payRoundWinnings,
} from '../redux/actions';

import {
  getRoom,
  getPlayers,
  getGame,
  getPlayerById,
  getRoundLow,
  getRoundHigh,
  getRoundLowWinnings,
  getRoundHighWinnings,
} from '../redux/selectors';

import Dice from './Dice';
import SummaryModal from './SummaryModal';
import { HLDButton } from './Buttons';

const Round = props => {
  const [isHost, setIsHost] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const {
    nextRound,
    collectRoundFees,
    payRoundWinnings,
    players,
    playerInTurn,
    roundLow,
    roundHigh,
    roundLowWinnings,
    roundHighWinnings,
  } = props;
  const { roomId, roomName, username } = props.room;
  const { gameOn, round, turn, rolls, waiting } = props.game;

  const io = useContext(SocketioContext);

  useEffect(() => {
    if (gameOn && turn > players.length) {
      setShowSummary(true);
    }
    if (players.length > 0) {
      setIsHost(username === players[0].name);
    }
  }, [gameOn, players, turn, username]);

  const handleNewGame = () => {
    io.startNewGame(roomId);
  };

  const handleStartNextRound = () => {
    setShowSummary(false);
    payRoundWinnings(roundLow, roundHigh, roundLowWinnings, roundHighWinnings);
    if (round < 6) {
      collectRoundFees(roomName);
    }
    nextRound();
  };

  return (
    <>
      {gameOn && (
        <>
          <Container fluid={false} className='round-container'>
            <div>
              <div>Round: {round}</div>
              <div>
                {'Player in turn: '}
                {gameOn && turn <= players.length ? playerInTurn.name : ''}
              </div>
              <div>Rolls: {rolls}</div>
            </div>
          </Container>
          <Dice showRoundModal={showSummary} />
        </>
      )}
      <div>
        {!gameOn && isHost && (
          <HLDButton
            title='New Game'
            className='new-game-button'
            disabled={players.length < 3 || round > 6}
            handleClick={handleNewGame}
          />
        )}
      </div>
      <SummaryModal
        show={showSummary}
        handleClose={handleStartNextRound}
        buttonText={'Next Round'}
      >
        <p className='summary-divs-title'>Round {round} summary</p>
        <table className='summary-table'>
          <tbody>
            {players.map(player => {
              return (
                <tr key={`player-${player.id}`}>
                  <td className='summary-table-td-first'>{player.name}</td>
                  <td className='summary-table-td'>
                    {player.rolls[round - 1]}
                  </td>
                  <td className='summary-table-td'>rolls</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SummaryModal>
      <SummaryModal
        show={round > 6}
        handleClose={handleNewGame}
        title={`Game summary`}
        buttonText={'New Game'}
        showButton={_.isEmpty(waiting)}
      >
        <p className='summary-divs-title'>Game summary</p>
        <table className='summary-table'>
          <tbody>
            {players.map(player => {
              return (
                <tr key={`player-${player.id}`}>
                  <td className='summary-table-td-first'>{player.name}</td>
                  <td className='summary-table-td'>scored</td>
                  <td className='summary-table-td'>{player.score}</td>
                  <td className='summary-table-td'>points</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SummaryModal>
    </>
  );
};

export default connect(
  state => ({
    room: getRoom(state),
    game: getGame(state),
    players: getPlayers(state),
    playerInTurn: getPlayerById(state, state.game.turn),
    roundLow: getRoundLow(state, state.game.round),
    roundHigh: getRoundHigh(state, state.game.round),
    roundLowWinnings: getRoundLowWinnings(state, state.game.round),
    roundHighWinnings: getRoundHighWinnings(state, state.game.round),
  }),
  { nextRound, collectRoundFees, payRoundWinnings }
)(Round);
