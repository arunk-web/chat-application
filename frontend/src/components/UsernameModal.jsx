import { useState } from 'react';

const UsernameModal = ({ onSetUsername }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {

    e.preventDefault();
    
    if (name.trim() === '')  return;

    onSetUsername(name.trim());
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your username"
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.button}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '15px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UsernameModal;