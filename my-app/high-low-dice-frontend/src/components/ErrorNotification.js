import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HIDE_ERROR } from '../redux/actionTypes';
import InfoModal from './InfoModal';

const ErrorNotification = props => {
  const isOpen = useSelector(state => state.error.isOpen);
  const error = useSelector(state => state.error.error);
  const dispatch = useDispatch();

  const handleErrorClose = () => {
    dispatch({ type: HIDE_ERROR });
  };

  return (
    <>
      {isOpen && error && (
        <InfoModal
          title={`Error notification`}
          show={isOpen}
          handleClose={handleErrorClose}
        >
          <p>Error: {error}</p>
        </InfoModal>
      )}
    </>
  );
};

export default ErrorNotification;
