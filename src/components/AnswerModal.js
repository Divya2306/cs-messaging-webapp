// AnswerModal.js

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust the URL as necessary

const AnswerModal = ({ show, onHide, messageId }) => {
  const [answer, setAnswer] = useState('');

  const handleResponse = async () => {
    const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });

    if (response.ok) {
      const updatedMessage = await response.json(); // Get the updated message

      // Emit an event to notify all clients about the updated message
      socket.emit('messageAnswered', updatedMessage); // Emit the updated message
      alert('Response saved successfully.');
      onHide(); // Close modal
      window.location.reload(); // Refresh the page
    } else {
      alert('Error responding to message.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Answer Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="form-control"
          placeholder="Type your answer here..."
          rows="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleResponse}>
          Save Answer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnswerModal;
