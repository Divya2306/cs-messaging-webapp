import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion'; // Animation

const socket = io('https://cs-messaging-webapp-z7i3.onrender.com');

const AnswerModal = ({ show, onHide, messageId }) => {
  const [answer, setAnswer] = useState('');

  const handleResponse = async () => {
    const response = await fetch(`https://cs-messaging-webapp-z7i3.onrender.com/api/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });

    if (response.ok) {
      const updatedMessage = await response.json();
      socket.emit('messageAnswered', updatedMessage);
      alert('Response saved successfully.');
      onHide();
    } else {
      alert('Already answered by another agent.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <Button variant="primary" onClick={handleResponse}>Save Answer</Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default AnswerModal;
