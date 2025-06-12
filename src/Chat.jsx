import React from 'react'


const ChatView = ({ data }) => {
  return (
    <div className="dataDisplay">
      <div className="message-container">
        <pre className="message-text">{data}</pre>
      </div>
    </div>
  );
};


export default ChatView
