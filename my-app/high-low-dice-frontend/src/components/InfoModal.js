import React from 'react';
import { Modal } from 'react-bootstrap';
import '../App.css';

const InfoModal = props => {
  const { show, title, handleClose } = props;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName='infoModal'
      aria-labelledby='contained-modal-title-vcenter'
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title as='h6' id='contained-modal-title-vcenter'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>{props.children}</Modal.Body>
    </Modal>
  );
};

export default InfoModal;
