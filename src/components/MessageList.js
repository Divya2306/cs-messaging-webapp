import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MessageItem from './MessageItem';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const socket = io('https://cs-messaging-webapp-z7i3.onrender.com');

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('https://cs-messaging-webapp-z7i3.onrender.com/api/messages');
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    socket.on('messageAnswered', (updatedMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off('messageAnswered');
    };
  }, []);

  const filteredMessages = messages.filter(message => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = message.message.toLowerCase().includes(searchTerm) ||
                          message.customerId.toLowerCase().includes(searchTerm);
    const matchesStatus = message.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="message-list">
      <div className="header-section text-center mb-4 p-3" style={{ 
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
        color: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 className="mb-2" style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
          letterSpacing: '1px',
        }}>
          <FaEnvelopeOpenText style={{ marginRight: '10px', fontSize: '2rem' }} /> 
          Customer Messages
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          fontWeight: '300', 
          color: '#f1f1f1',
          letterSpacing: '0.5px'
        }}>
          Manage customer queries efficiently
        </p>
      </div>

      <div className="d-flex mb-4">
        <select 
          className="form-select me-2" 
          style={{ width: '120px' }} 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search messages or Customer ID..."
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMessages.length > 0 ? (
        filteredMessages.map(message => (
          <MessageItem key={message._id} message={message} />
        ))
      ) : (
        <p className="text-center">No messages found.</p>
      )}
    </div>
  );
};

export default MessageList;
