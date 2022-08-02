import React from 'react';
import { Modal } from 'react-bootstrap';
import '../App.css';

import { HLDButton } from './Buttons';

const SummaryModal = props => {
  const { show, handleClose, showButton = true, buttonText = '' } = props;
  return (
    <Modal
      show={show}
      dialogClassName='infoModal'
      aria-labelledby='contained-modal-title-vcenter'
      size='sm'
    >
      <Modal.Body className='modal-body'>
        {props.children}
        {showButton && (
          <HLDButton
            title={buttonText}
            className='modal-button float-right'
            handleClick={handleClose}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SummaryModal;
