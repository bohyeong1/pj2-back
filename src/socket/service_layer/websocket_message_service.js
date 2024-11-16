const Message = require('../../models/Message')
const MessageRoom = require('../../models/MessageRoom')
const message_dto = require('../../dto/message_dto')
const User = require('../../models/User')
const admin = require('../../config/firebase_config')

class websocket_message_service{

    // =================================================
    // join message room //
    async join_message_room(socket, user_dto, message_room_dto){
        socket.on('join_room', async() => {
            user_dto.validate_token()
            message_room_dto.validate_alter_under_id()

            try{
                const message_room = await MessageRoom.findOne(
                    {
                        _id : message_room_dto._id 
                    }
                )

                const real_token = user_dto.token.split(' ')[1]
                const verify_token = await admin.auth().verifyIdToken(real_token)
                const uid = verify_token.uid           
                const user = await User.findOne({firebase_uid: uid})

                if(!user){
                    return socket.emit('error', {
                        code : 401,
                        message : '해당되는 유저가 존재하지 않습니다.',
                    })
                }

                if(!message_room){
                    return socket.emit('error', {
                        code : 401,
                        message : '해당되는 메세지룸이 존재하지 않습니다.',
                    })
                }
        
                if(!message_room.participants.includes(user._id)) {
                    return socket.emit('error', {
                        code : 401,
                        message : '유효하지 않은 사용자 입니다.',
                    })
                }
        
                socket.join(message_room._id.toString())
            
                return socket.emit('join_room', {
                    message_room : message_room._id,
                    message : 'message room 연동 성공',
                })
            }catch(e){
                return socket.emit('error', {
                    code : 500,
                    message : '메세지룸 참가 중 오류가 발생하였습니다.',
                })
            }
        })
    }


    // =================================================
    // send message //
    async save_message(socket, io){
        socket.on('send_message', async(data) => {
            try{
                console.log(data)
                const target_message = new message_dto(
                    {
                        content : data.content,
                        room_id : data.room_id,
                        sender_id : data.sender_id
                    }
                )
                target_message.validate_content()
                target_message.validate_alter_under_sender_id()
                target_message.validate_alter_under_room_id()

                const message = new Message({
                    room_id: target_message.room_id,
                    sender_id: target_message.sender_id,
                    content: target_message.content,
                })

                await message.save()
    
                io.to(target_message.room_id).emit('new_message', {
                    room_id : message.room_id,
                    sender_id : message.sender_id,
                    message
                })
            }catch(e){
                console.log(e)
                socket.emit('error', {
                    code : 500,
                    message : '메세지 전송 중 오류가 발생하였습니다.',
                })
            }
        })
    }

}

module.exports = websocket_message_service