// AIzaSyCgYXPq8bWMiGNerDovPvkqflaK5kmamNA
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import dotenv from 'dotenv';
import { ListenToConversations } from './Sockets/Conversations.js';

dotenv.config();

const PORT = 9876;
const app = express();
const server = http.createServer(app);

// Attach Socket.IO to HTTP server
const io = new Server(server, {
    cors: {
        origin: '*', // allow any origin (customize in prod)
    }
});

app.get('/', (req, res) => {
    res.send('Socket.IO with ESM!');
});

ListenToConversations(io)

// Socket.IO connection handler
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('message', (msg) => {
//         console.log('Message received:', msg);
//         socket.broadcast.emit('message', msg); // broadcast to others
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });


server.listen(PORT, () => {
    console.log(`Server running at PORT : ${PORT}`);
});
// ------------------------------------------------------------------------









// app.get('/', async (req, res) => {
//     const { prompt } = req.query;
//     try {
//         const result = await runPrompt(prompt);
//         return res.json({ status: 200, message: result });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('An error occurred');
//     }
// });




// ---------------------------------------------------------------------------
