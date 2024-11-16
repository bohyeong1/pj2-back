const socket_io = require('socket.io')
const {websocket_message_controller} = require('./controller/websocket_message_controller')

module.exports = (server) => {
    const io = socket_io(server, {
        cors: {
            origin: "https://localhost:5000",
            credentials: true,
        }
    })

    io.on('connection', (socket) => {
        console.log('웹소켓 연동 완료')
        websocket_message_controller(socket, io)
    })
}