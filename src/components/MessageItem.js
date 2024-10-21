import React, { useState } from 'react';
import { FaEnvelope, FaClock, FaUser } from 'react-icons/fa';
import AnswerModal from './AnswerModal';
import { Card, Button, Alert } from 'react-bootstrap';
import Fade from 'react-reveal/Fade'; // Add animation
import "./MessageItem.css";

const MessageItem = ({ message }) => {
  const [modalShow, setModalShow] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  const handleAnswerClick = () => {
    if (message.status === 'closed') {
      setAlreadyAnswered(true);
    } else {
      setModalShow(true);
    }
  };

  return (
    <Fade bottom> {/* Adds a fade-in effect */}
      <Card className="mb-3 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-primary">
              <FaUser className="me-2" /> User ID: {message.customerId}
            </h5>
            <p className="text-muted">
              <FaClock className="me-2" /> {new Date(message.timestamp).toLocaleString()}
            </p>
          </div>
          <Card.Text>
            <strong>Message:</strong> {message.message}
          </Card.Text>
          <Card.Text className="mb-3">
            <strong>Status:</strong> <span className={`badge ${message.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>{message.status}</span>
          </Card.Text>
          <Button variant="primary" className="glow-on-hover" onClick={handleAnswerClick}>
            <FaEnvelope className="me-2" /> Answer
          </Button>

          <AnswerModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            messageId={message._id}
          />

          {alreadyAnswered && (
            <Alert variant="warning" className="mt-3">
              This message has already been answered by another agent.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Fade>
  );
};

export default MessageItem;
