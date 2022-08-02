import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';

import { getGame, getPlayers } from '../redux/selectors';

const Players = props => {
  const { players } = props;
  const { roundLows, roundHighs } = props.game;

  return (
    <>
      <Container fluid={false} className='players-container'>
          <table className='players-table'>
            <tbody>
              <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Round 1</th>
                <th>Round 2</th>
                <th>Round 3</th>
                <th>Round 4</th>
                <th>Round 5</th>
                <th>Round 6</th>
              </tr>
              {players && players.length ? (
                players.map(player => {
                  return (
                    <tr key={`player-${player.id}`}>
                      <td>{player.name}</td>
                      <td>{player.score}</td>
                      {player.rolls.map((value, index) => {
                        if (value === roundLows[index]) {
                          return (
                            <td className='low' key={index}>
                              {value}
                            </td>
                          );
                        } else if (value === roundHighs[index]) {
                          return (
                            <td className='high' key={index}>
                              {value}
                            </td>
                          );
                        } else if (
                          value < roundLows[index] ||
                          value > roundHighs[index]
                        ) {
                          return (
                            <td className='lower-or-higher' key={index}>
                              {value}
                            </td>
                          );
                        } else {
                          return <td key={index}>{value}</td>;
                        }
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No players</td>
                </tr>
              )}
            </tbody>
          </table>
      </Container>
    </>
  );
};

export default connect(
  state => ({
    game: getGame(state),
    players: getPlayers(state)
  }),
  null
)(Players);
