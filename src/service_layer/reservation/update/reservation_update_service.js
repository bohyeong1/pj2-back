const Reservation = require('../../../models/Reservation')
const Message = require('../../../models/Message')
const MessageRoom = require('../../../models/MessageRoom')
const User = require('../../../models/User')
const error_dto = require('../../../dto/error_dto')
const mongoose = require('mongoose')
const {is_valid_user, check_reservation_category} = require('../../../util_function/util_function')

class reservation_update_service{
    // =================================================
    // 숙소 예약상품 환불하기 //
    async refund_reservation(user_dto, reservation_dto){
        user_dto.validate_token()
        reservation_dto.validate_alter_under_id()   

        let attempt = 0
        const max_attempt = 3

        while(attempt < max_attempt){
            const session = await mongoose.startSession()
            session.startTransaction()

            try{    
                const user_data = await is_valid_user(user_dto)

                if(!user_data.user_state){
                    return user_data
                }

                const user = user_data.user

                const reservation = await Reservation.findOne({
                    _id : reservation_dto._id,
                    buyer : user._id
                })
                .populate([
                    {
                        path : 'buyer'
                    },
                    {
                        path : 'seller',
                        populate : {path : 'host_text'}
                    }
                ])
                .session(session)

                if(!reservation){
                    throw new error_dto({
                        code: 401,
                        message: '인증절차 중 문제가 발생 하였습니다.',
                        server_state: false
                    })
                }

                const host = reservation.seller
                const host_information = reservation.seller.host_text
                const checkin_date = new Date(reservation.checkin)

                const result_price = check_reservation_category(host_information.refund_rule.title, checkin_date, reservation.total_price, reservation.stay_day)

                if(!result_price || result_price.result < 0){
                    throw new error_dto({
                        code: 401,
                        message: '인증절차 중 문제가 발생 하였습니다.',
                        server_state: false
                    })
                }

                if((host.cashInv - result_price.result) < 0){
                    // host 계정 잠그기
                }

                // 환불
                user.cashInv += result_price.result
                await user.save({session})
                await User.findByIdAndUpdate(
                    host._id,
                    {$inc : {cashInv: -result_price.result}},
                    {session}
                )

                // 메세지, 예약상태 변경 및 삭제
                reservation.reservation_state = 'refund_success'
                reservation.use_state = true
                reservation.refund_at = new Date()
                reservation.refund_price = result_price.result
                await reservation.save({session})

                const message_room = await MessageRoom.findOneAndDelete(
                    {
                        reservation_id : reservation._id,
                        guest_id : user.userId,
                        checkin : new Date(reservation.checkin),
                        checkout : new Date(reservation.checkout)
                    }
                )
                .session(session)

                await Message.deleteMany({ room_id: message_room._id }).session(session)

                await session.commitTransaction()
                session.endSession()

                return {
                    code : 200,
                    server_state : true,
                    reservation_state : true,
                    cash_state : true
                }

            }catch(e){
                console.log(e)
                await session.abortTransaction()
                session.endSession()

                if(e.hasErrorLabel && e.hasErrorLabel('TransientTransactionError')){
                    attempt++
                }else{        
                    throw new error_dto({
                        code: 401,
                        message: '인증절차 중 문제가 발생 하였습니다.',
                        server_state: false,
                        error : e
                    })
                }
            }
        }

        throw new error_dto({
            code: 500,
            message: '트랜잭션 재시도 한도를 초과하였습니다.',
            server_state: false
        })
    }
}

module.exports = reservation_update_service