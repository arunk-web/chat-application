import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

    return () => {
        socketRef.current.disconnect();
    };
}, []);

return socketRef;
};

export default useSocket;