import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ModalCommentForm({ show, handleClose, onSave}) {
  const [comment, setComment] = useState('');

  const handleCommentInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSave = () => {
    if (comment == '') {
      alert('Por favor, escriba un comentario para poder continuar.');
      return;
    }
    onSave(comment);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ingresa tu comentario:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCommentInput">
            <Form.Control
              type="text"
              placeholder="Comentario"
              value={comment}
              onChange={handleCommentInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCommentForm;