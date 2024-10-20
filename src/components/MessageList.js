// MessageList.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import MessageItem from './MessageItem';

const socket = io('http://localhost:5000'); // Adjust the URL as necessary

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://localhost:5000/api/messages'); // Adjust the URL as necessary
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    // Listen for message updates from the server
    socket.on('messageAnswered', (updatedMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off('messageAnswered'); // Clean up the listener on component unmount
    };
  }, []);

  // Separate messages into open and closed
  const openMessages = messages.filter(msg => msg.status === 'open');
  const closedMessages = messages.filter(msg => msg.status === 'closed');

  const sortedMessages = [...openMessages, ...closedMessages];

  // Filter messages based on search query
  const filteredMessages = sortedMessages.filter(message => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      message.message.toLowerCase().includes(searchTerm) || // Search by message content
      message.customerId.toLowerCase().includes(searchTerm) // Search by customer ID
    );
  });

  return (
    <div className="message-list">
      <h2 className="text-center mb-4">Customer Messages</h2>
      
      {/* Search Input */}
      <div className="mb-4">
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
