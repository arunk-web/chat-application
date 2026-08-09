import { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    if (onTyping) onTyping();

    // Reset the "stop typing" timer every time user types
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    onSendMessage(text.trim());
    setText('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={text}
        onChange={handleChange}

        placeholder="Type a message..."
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Send
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    padding: '10px',

    borderTop: '1px solid #ddd',

    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px',

    borderRadius: '20px',

    border: '1px solid #ccc',
    outline: 'none',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    background: '#4CAF50',

    color: '#fff',
    border: 'none',

    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default MessageInput;