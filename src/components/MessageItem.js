import React, { useState } from 'react';
import { FaEnvelope, FaClock, FaUser } from 'react-icons/fa';
import AnswerModal from './AnswerModal';

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
    <div className="message-item border rounded p-3 my-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5>
          <FaUser /> User ID: {message.customerId}
        </h5>
        <p className="text-muted">
          <FaClock /> {new Date(message.timestamp).toLocaleString()}
        </p>
      </div>
      <p><strong>Message:</strong> {message.message}</p>
      <p><strong>Status:</strong> {message.status}</p>
      <button className="btn btn-primary" onClick={handleAnswerClick}>
        <FaEnvelope /> Answer
      </button>

      <AnswerModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        messageId={message._id}
      />

      {alreadyAnswered && (
        <div className="alert alert-warning mt-3" role="alert">
          This message has already been answered by another agent.
        </div>
      )}
    </div>
  );
};

export default MessageItem;
