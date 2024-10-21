import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import Zoom from 'react-reveal/Zoom'; // Animation

const socket = io('https://cs-messaging-webapp-z7i3.onrender.com'); // Adjust the URL as necessary

const AnswerModal = ({ show, onHide, messageId }) => {
  const [answer, setAnswer] = useState('');

  const handleResponse = async () => {
    const response = await fetch(`https://cs-messaging-webapp-z7i3.onrender.com/api/messages/${messageId}`, {
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
    } else {
      alert('Already answered by another agent.');
    }
  };

  return (
    <Zoom> {/* Adds Zoom-in effect */}
      <Modal show={show} onHide={onHide} centered>
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
    </Zoom>
  );
};

export default AnswerModal;
