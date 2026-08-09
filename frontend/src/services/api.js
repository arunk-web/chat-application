import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchMessages = async () => {
    try {
    const response = await axios.get(API_URL);
    return response.data;
    } catch (error) {
    console.error('Error fetching messages:', error.message);
    throw error;
    }
};

export const sendMessageAPI = async (username, text) => {
try {
    const response = await axios.post(API_URL, { username, text });
    return response.data;
} catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
}
};