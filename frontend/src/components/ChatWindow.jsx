import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = ({
  messages,
  onSendMessage,
  currentUser,

  onlineUsers,
  typingUser,
  onTyping,

  onStopTyping,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>

        <div>Chat App — Logged in as {currentUser}</div>
        <div style={styles.onlineText}>
          🟢 Online: {onlineUsers.join(', ')}
        </div>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
            
          <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
        ))}
        <div ref={bottomRef} />
      </div>

      {typingUser && typingUser !== currentUser && (
        <div style={styles.typingIndicator}>{typingUser} is typing...</div>
      )}

      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        onStopTyping={onStopTyping}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '500px',
    margin: '0 auto',
    background: '#ECE5DD',
  },
  header: {
    padding: '15px',
    background: '#4CAF50',
    color: '#fff',
  },
  onlineText: {
    fontSize: '12px',
    marginTop: '4px',
    opacity: 0.9,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  typingIndicator: {
    padding: '5px 15px',
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#555',
  },
};

export default ChatWindow;