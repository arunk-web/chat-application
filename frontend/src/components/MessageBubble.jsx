const MessageBubble = ({ message, currentUser }) => {
  const isOwnMessage = message.username === currentUser;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatus = () => {
    if (!isOwnMessage) return null;
    if (message.status === 'sent') return <span style={styles.tick}>✓</span>;
    if (message.status === 'delivered') return <span style={styles.tickBlue}>✓✓</span>;
    return null;
  };

  return (
    <div
      style={{
        ...styles.bubbleWrapper,
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          ...styles.bubble,
          backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
        }}
      >
        {!isOwnMessage && <p style={styles.username}>{message.username}</p>}
        <p style={styles.text}>{message.text}</p>
        <span style={styles.time}>
          {formatTime(message.timestamp)} {renderStatus()}
        </span>
      </div>
    </div>
  );
};

const styles = {
  bubbleWrapper: { display: 'flex', marginBottom: '8px' },
  bubble: {
    maxWidth: '60%',
    padding: '8px 12px',
    borderRadius: '10px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
  },
  username: { margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#4CAF50' },
  text: { margin: '2px 0', fontSize: '14px', wordBreak: 'break-word' },
  time: { fontSize: '10px', color: '#888', display: 'block', textAlign: 'right' },
  tick: { color: '#888', marginLeft: '4px' },
  tickBlue: { color: '#4FC3F7', marginLeft: '4px' },
};

export default MessageBubble;