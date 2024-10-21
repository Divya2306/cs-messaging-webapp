import React from 'react';
import MessageList from './components/MessageList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div 
      className="app-container" 
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', 
        padding: '50px 0'
      }}
    >
      <div 
        className="container p-5"
        style={{ 
          background: '#fff', 
          borderRadius: '15px', 
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h1 
          className="text-center my-4"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#333',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
            letterSpacing: '1px',
            marginBottom: '30px'
          }}
        >
          Customer Service
        </h1>

        {/* Message List Component */}
        <MessageList />
      </div>
    </div>
  );
};

export default App;
