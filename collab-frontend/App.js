import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to our Node.js backend
const socket = io('http://localhost:3001');

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    // Listen for incoming changes from the server
    socket.on('receive-changes', (incomingText) => {
      setText(incomingText);
    });

    // Cleanup the connection when the component unmounts
    return () => {
      socket.off('receive-changes');
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText); // Update our own screen
    socket.emit('send-changes', newText); // Send it to the backend to broadcast
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Real-Time Editor Engine</h1>
      <textarea 
        value={text}
        onChange={handleChange}
        style={{ width: '80%', height: '400px', fontSize: '18px', padding: '10px' }}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;