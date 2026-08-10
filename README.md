# Real-Time Chat Application (MERN + Socket.io)

A real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io. Users can join with a username, send and receive messages instantly, view chat history after refresh, and see typing indicators, online users, and message delivery status.

## Tech Stack

**Frontend:** React (Vite), Socket.io-client, Axios
**Backend:** Node.js, Express, Socket.io, Mongoose
**Database:** MongoDB

## Features

- Real-time messaging using Socket.io (no polling)
- Persistent chat history stored in MongoDB
- Message timestamps
- Username-based dummy login
- Typing indicator ("X is typing...")
- Online users list
- Sent / Delivered message status (ticks)
- Graceful handling of API and socket errors

## Project Structure

```
chat-app/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST API routes
│   ├── controllers/     # Route logic
│   ├── socket/          # Socket.io event handlers
│   ├── server.js        # Entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/  # UI components
    │   ├── hooks/       # Custom hooks (socket connection)
    │   ├── services/    # API calls
    │   ├── App.jsx
    │   └── main.jsx
    └── .env
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm
- A MongoDB connection string (MongoDB Atlas or local MongoDB)

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd chat-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```

Run the backend:

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```
VITE_API_URL=http://localhost:5000/api/messages
VITE_SOCKET_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Using the App

1. Open `http://localhost:5173` in your browser.
2. Enter a username to join the chat.
3. Open the same URL in another tab/browser (with a different username) to test real-time messaging.

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `PORT` | Port on which the backend server runs (default: 5000) |
| `MONGO_URI` | MongoDB connection string |

**Frontend (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for REST API calls |
| `VITE_SOCKET_URL` | URL the frontend connects to for Socket.io |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages` | Fetch all chat messages |
| POST | `/api/messages` | Save a new message |

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `user_join` | Client → Server | Notifies server a user has joined |
| `send_message` | Client → Server | Sends a new message |
| `receive_message` | Server → Client | Broadcasts a new message to all clients |
| `typing` | Client → Server | User started typing |
| `stop_typing` | Client → Server | User stopped typing |
| `user_typing` | Server → Client | Broadcasts who is typing |
| `user_stop_typing` | Server → Client | Broadcasts typing has stopped |
| `online_users` | Server → Client | Broadcasts the current list of online users |

## Design Decisions

- **Socket.io over polling:** Used for true real-time, bidirectional communication as required by the assignment, instead of repeatedly polling the REST API.
- **REST + Socket.io combined:** REST APIs handle initial chat history load (on refresh); Socket.io handles all real-time updates after that, avoiding redundant network calls.
- **Optimistic UI for message status:** When a user sends a message, it appears instantly in the UI with a "sent" status (single tick), then updates to "delivered" (double tick) once the server confirms it was saved and broadcast. This is done using a temporary client-generated ID (`tempId`) to match the optimistic message with the server's response.
- **Single global chat room:** All connected users are in one shared room (no private/direct messaging), which keeps the scope aligned with the assignment requirements.
- **Debounced typing indicator:** The frontend waits 1.5 seconds of inactivity before emitting `stop_typing`, to avoid flooding the server with events on every keystroke.
- **In-memory online users tracking:** Online users are tracked using a `Map` on the server (`socket.id → username`), reset on server restart. This is sufficient for the assignment scope; a production app would persist presence in a shared store like Redis for multi-instance deployments.

## Assumptions

- No real authentication is required — a simple username entry (dummy login) is used to identify users, as explicitly allowed by the assignment.
- All users chat in a single shared room; there is no concept of separate one-to-one conversations.
- "Delivered" status reflects that the message was successfully saved to the database and broadcast by the server — not per-recipient device delivery, since the app is not structured around 1-to-1 rooms.
- The app is intended to be used with a modern browser with WebSocket support.

## Live Demo

- Frontend: https://chat-application-sable-three.vercel.app
- Backend API: https://chat-application-backend-3rp0.onrender.com
