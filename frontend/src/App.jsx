import { useState, useEffect, useCallback } from 'react';
import useSocket from './hooks/useSocket';
import { fetchMessages } from './services/api';
import ChatWindow from './components/ChatWindow';
import UsernameModal from './components/UsernameModal';

function App() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const socketRef = useSocket();

  // Load previous messages on first render
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        // purane messages hamesha "delivered" maano
        setMessages(data.map((msg) => ({ ...msg, status: 'delivered' })));
      } catch (error) {
        console.error('Failed to load messages:', error.message);
      }
    };

    loadMessages();
  }, []);

  // Tell backend this user has joined (once username is set)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !username) return;

    socket.emit('user_join', username);
  }, [username, socketRef]);

  // Listen for all socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => {
        // Agar ye apna hi message hai jo tempId se match ho raha hai, use update karo
        if (newMessage.tempId) {
          const exists = prevMessages.find((m) => m.tempId === newMessage.tempId);
          if (exists) {
            return prevMessages.map((m) =>
              m.tempId === newMessage.tempId
                ? { ...newMessage, status: 'delivered' }
                : m
            );
          }
        }
        // Warna naya message hai (kisi aur ne bheja), normal add karo
        return [...prevMessages, { ...newMessage, status: 'delivered' }];
      });
    });

    socket.on('error_message', (errorMsg) => {
      console.error('Socket error:', errorMsg);
    });

    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('user_typing', (typingUsername) => {
      setTypingUser(typingUsername);
    });

    socket.on('user_stop_typing', () => {
      setTypingUser('');
    });

    return () => {
      socket.off('receive_message');
      socket.off('error_message');
      socket.off('online_users');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socketRef]);

  const handleSendMessage = useCallback(
    (text) => {
      const socket = socketRef.current;
      if (!socket) return;

      const tempId = `${Date.now()}-${Math.random()}`;

      // Optimistic UI: turant "sent" status ke saath dikhao
      const optimisticMessage = {
        tempId,
        username,
        text,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      socket.emit('send_message', { username, text, tempId });
      socket.emit('stop_typing', username);
    },
    [username, socketRef]
  );

  const handleTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('typing', username);
  }, [username, socketRef]);

  const handleStopTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('stop_typing', username);
  }, [username, socketRef]);

  if (!username) {
    return <UsernameModal onSetUsername={setUsername} />;
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      currentUser={username}
      onlineUsers={onlineUsers}
      typingUser={typingUser}
      onTyping={handleTyping}
      onStopTyping={handleStopTyping}
    />
  );
}

export default App;
