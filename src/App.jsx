import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the Express server
const socket = io('http://localhost:3001');

export default function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // Listen for the server's "receive_message" push
    socket.on('receive_message', (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    // Push data to the server (and eventually to Mongo)
    socket.emit('send_message', message);
    setMessage("");
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Real-Time Chat (Mongo + Socket)</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: '20px' }}>
        {chatLog.map((msg, i) => (
          <p key={i} style={{ borderBottom: '1px solid #ccc' }}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
