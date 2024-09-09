const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Set default nickname
    ws.nickname = 'Anonymous';

    // Handle incoming messages
    ws.on('message', (message) => {
        if (Buffer.isBuffer(message)) {
            message = message.toString();
        }

        console.log(`Received message: ${message}`);  // Debugging line

        const [type, payload] = message.split(':');

        if (type === 'SET_NICKNAME') {
            ws.nickname = payload;  // Set the nickname
            console.log(`Nickname set to: ${ws.nickname}`);  // Debugging line
        } else if (type === 'MESSAGE') {
            const time = new Date().toLocaleTimeString();
            const fullMessage = `${time} - ${ws.nickname}: ${payload}`;
            
            // Broadcast the message to all clients
            broadcastMessage(fullMessage);
        } else {
            console.log('Unknown message type:', type);  // Debugging line
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`${ws.nickname} has disconnected`);
        broadcastMessage(`${ws.nickname} has left the chat`);
    });
});

// Function to broadcast messages to all clients
function broadcastMessage(message) {
    console.log(`Broadcasting message: ${message}`);  // Debugging line
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('WebSocket server is listening on ws://localhost:8080');
