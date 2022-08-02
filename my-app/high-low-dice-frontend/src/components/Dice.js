import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { SocketioContext } from '../connection/socketio';
import Container from 'react-bootstrap/Container';
import _ from 'lodash';

import {
  nextPlayer,
  waitingPlayers,
  updateRoundLow,
  updateRoundHigh,
} from '../redux/actions';
import {
  getRoom,
  getGame,
  getPlayers,
  getPlayerById,
  getDice,
} from '../redux/selectors';

import { HLDButton } from './Buttons';
import SummaryModal from './SummaryModal';

const Dice = props => {
  const [showSummary, setShowSummary] = useState(false);

  const dice1 = require('../media/dice-1.png');
  const dice2 = require('../media/dice-2.png');
  const dice3 = require('../media/dice-3.png');
  const dice4 = require('../media/dice-4.png');
  const dice5 = require('../media/dice-5.png');
  const dice6 = require('../media/dice-6.png');

  const dicePngs = ['dice-png-array', dice1, dice2, dice3, dice4, dice5, dice6];

  const {
    nextPlayer,
    waitingPlayers,
    updateRoundLow,
    updateRoundHigh,
    players,
    playerInTurn,
  } = props;
  const { roomId, username } = props.room;
  const { gameOn, round, turn, rolls, roundLows, roundHighs, waiting } =
    props.game;
  const { dice } = props.dice;

  const io = useContext(SocketioContext);
  const user = _.find(players, { name: username });
  let userId;
  if (user) userId = user.id;

  useEffect(() => {
    if (dice.every(die => die.ready)) {
      waitingPlayers();
      setShowSummary(true);
    }
  }, [dice, waitingPlayers]);

  const updateRoundLowAndHigh = () => {
    if (playerInTurn.id === 1) {
      updateRoundLow(round, rolls);
      updateRoundHigh(round, rolls);
    } else if (rolls < roundLows[round - 1]) {
      updateRoundLow(round, rolls);
    } else if (rolls > roundHighs[round - 1]) {
      updateRoundHigh(round, rolls);
    }
  };

  const rollDice = () => {
    io.rollDice(roomId, round, turn, rolls);
  };

  const handleTurnEnd = () => {
    setShowSummary(false);
    updateRoundLowAndHigh();
    io.playerReady(roomId, userId);
    nextPlayer();
  };

  return (
    <>
      <Container className='dice-container'>
        <table className='dice-table'>
          <tbody>
            <tr>
              {dice.map((die, index) => {
                return (
                  <td className='dice-td' key={index}>
                    {die.ready ? (
                      <img
                        className='dice-pic'
                        alt='dice'
                        src={dicePngs[die.value]}
                      />
                    ) : (
                      '_'
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              {dice.map((die, index) => {
                return (
                  <td className='dice-td' key={index}>
                    {!die.ready && die.value ? (
                      <img
                        className='dice-pic'
                        alt='dice'
                        src={dicePngs[die.value]}
                      />
                    ) : (
                      '_'
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        <HLDButton
          title='Roll Dice'
          className='roll-dice-Button'
          disabled={
            !gameOn ||
            playerInTurn.name !== username ||
            round > 6 ||
            showSummary
          }
          handleClick={rollDice}
        />
      </Container>
      <SummaryModal
        show={showSummary}
        handleClose={handleTurnEnd}
        buttonText={'Next Player'}
      >
        <p className='summary-divs-title'>Turn summary</p>
        <p className='summary-divs'>Round: {round}</p>
        <p className='summary-divs'>Player: {playerInTurn.name}</p>
        <p className='summary-divs'>Rolls: {rolls}</p>
      </SummaryModal>
      <SummaryModal
        show={!showSummary && waiting.length !== 0}
        showButton={false}
      >
        <p className='summary-divs'>Waiting for ....</p>
        <p className='summary-divs'>
          {waiting.map(value => `${_.find(players, { id: value }).name}, `)}
        </p>
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
    dice: getDice(state),
  }),
  {
    nextPlayer,
    waitingPlayers,
    updateRoundLow,
    updateRoundHigh,
  }
)(Dice);
