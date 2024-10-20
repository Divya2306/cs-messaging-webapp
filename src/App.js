import React from 'react';
import MessageList from './components/MessageList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="container">
      <h1 className="text-center my-4">Customer Service</h1>
      <MessageList />
    </div>
  );
};

export default App;
