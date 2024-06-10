const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const CryptoJS = require('crypto-js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;
const SECRET_KEY = 'mysecretkey';

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('message', (encryptedMessage) => {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
        const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
        console.log('Decrypted message:', originalMessage);

        const responseMessage = CryptoJS.AES.encrypt(originalMessage, SECRET_KEY).toString();
        socket.broadcast.emit('message', responseMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


