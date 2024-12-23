const websocket_message_service = require('../service_layer/websocket_message_service')
const user_dto = require('../../dto/user_dto')
const cookie = require('cookie')

// =================================================
// 숙소 host, guest massage //
async function websocket_message_controller(socket, io){
    const cookies = cookie.parse(socket.request.headers.cookie || '')
    const auth_token = cookies.auth_token
    const websocket_message_service_layer = new websocket_message_service()
    const user = new user_dto({token : auth_token})

    websocket_message_service_layer.join_message_room(socket, user)
    websocket_message_service_layer.save_message(socket, io)
}

module.exports = {
    websocket_message_controller
}