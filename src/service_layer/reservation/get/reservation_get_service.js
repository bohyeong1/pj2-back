const Accomodation = require('../../../models/Accomodation')
const Reservation = require('../../../models/Reservation')
const Hostinformation = require('../../../models/Hostinformation')
const User = require('../../../models/User')
const Message = require('../../../models/Message')
const MessageRoom = require('../../../models/MessageRoom')
const error_dto = require('../../../dto/error_dto')
const {is_valid_user} = require('../../../util_function/util_function')
const {get_processed_messages} = require('../../../pipelines/user_pipe')

class reservation_get_service{
    // =================================================
    // guest 숙소 예약목록 list get //
    async get_reservation_list(user_dto){
        user_dto.validate_token()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const reservation = await Reservation.find({
                buyer : user._id,
                use_state : false
            }).populate([
                {
                    path : 'seller'
                },
                {
                    path : 'accomodation'
                }
            ])

            return {
                code : 200,
                server_state : true,
                reservation
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // host 숙소 예약목록 list get //
    async get_reservation_host_list(user_dto){
        user_dto.validate_alter_under_id()

        try{               
            const reservation = await Reservation.find({
                seller : user_dto._id,
                use_state : false
            })

            return {
                code : 200,
                server_state : true,
                reservation
            }

        }catch(e){
            if(e instanceof error_dto){
                throw e
            }
            else{
                throw new error_dto({
                    code: 500,
                    message: '서버에서 문제가 발생 하였습니다.',
                    server_state: false,
                    error : e
                })
            } 
        }
    }

    // =================================================
    // host 숙소 예약목록 detail list get //
    async get_reservation_host_detail_list(user_dto){
        user_dto.validate_alter_under_id()

        try{               
            const reservation = await Reservation.find({
                seller : user_dto._id,
                use_state : false
            }).populate([
                {
                    path : 'seller'
                },
                {
                    path : 'accomodation'
                }
            ])

            return {
                code : 200,
                server_state : true,
                reservation
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 이용 완료 목록 list get //
    async get_reservation_success_list(user_dto){
        user_dto.validate_token()

        try{    
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const reservation = await Reservation.find({
                buyer : user._id,
                use_state : true
            }).populate([
                {
                    path : 'seller'
                },
                {
                    path : 'accomodation'
                }
            ])

            return {
                code : 200,
                server_state : true,
                reservation
            }

        }catch(e){
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 예약목록 target get //
    async get_reservation_target(user_dto, reservation_dto){
        user_dto.validate_token()
        reservation_dto.validate_alter_under_id()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }

            const user = user_data.user

            const reservation = await Reservation.findOne({
                buyer : user._id,
                _id : reservation_dto._id
            }).populate([
                {
                    path : 'seller',
                    populate : {path : 'host_text'}
                },
                {
                    path : 'accomodation'
                }
            ])

            if(!reservation){
                throw new error_dto({
                    code: 401,
                    message: '해당하는 reservation을 찾을 수 없습니다.',
                    server_state: false,
                    error : e
                })
            }

            return {
                code : 200,
                server_state : true,
                reservation
            }

        }catch(e){
            throw new error_dto({
                code: 500,
                message: 'service layer에서 에러가 발생하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 예약 시 초기 메세지 detail get //
    async get_reservation_detail_message(user_dto, reservation_dto){
        user_dto.validate_token()
        reservation_dto.validate_alter_under_id()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }
            const user = user_data.user

            const pipe_line = get_processed_messages(user, reservation_dto._id)

            const message = await MessageRoom.aggregate(
                pipe_line
            )

            return {
                code : 200,
                server_state : true,
                message : message[0],
                user
            }

        }catch(e){
            throw new error_dto({
                code: 500,
                message: 'service layer에서 에러가 발생하였습니다.',
                server_state: false,
                error : e
            })
        }
    }

    // =================================================
    // 숙소 예약 시 message list get //
    async get_reservation_message_list(user_dto, reservation_dto){
        user_dto.validate_token()
        reservation_dto.validate_reservation_type()

        try{
            const user_data = await is_valid_user(user_dto)

            if(!user_data.user_state){
                return user_data
            }
            const user = user_data.user

            let message_rooms
            if(reservation_dto.type === 'guest'){
                message_rooms = await MessageRoom.find(
                    {
                        guest_id : user.userId
                    }
                ).populate(
                    {
                        path : 'participants'
                    }
                )
            }
            else{
                message_rooms = await MessageRoom.find(
                    {
                        host_id : user.userId
                    }
                ).populate(
                    {
                        path : 'participants'
                    }
                )
            }

            return {
                code : 200,
                server_state : true,
                message_rooms,
                user
            }

        }catch(e){
                throw new error_dto({
                code: 500,
                message: 'service layer에서 에러가 발생하였습니다.',
                server_state: false,
                error : e
            })
        }
    }
}

module.exports = reservation_get_service