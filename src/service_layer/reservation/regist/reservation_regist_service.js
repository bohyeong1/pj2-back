const Accomodation = require('../../../models/Accomodation')
const Reservation = require('../../../models/Reservation')
const Message = require('../../../models/Message')
const MessageRoom = require('../../../models/MessageRoom')
const User = require('../../../models/User')
const error_dto = require('../../../dto/error_dto')
const mongoose = require('mongoose')
const {is_valid_user} = require('../../../util_function/util_function')
const {addDays, setHours} = require('date-fns')

class reservation_regist_service{
    // =================================================
    // 숙소 예약 등록 //
    async regist_reservation(user_dto, accomodation_dto, reservation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()   

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

                const accomodation = await Accomodation.findOne({
                    _id : accomodation_dto._id
                }).populate([
                    {
                        path : 'seller',
                        populate : {path : 'host_text'}
                    },
                    {
                        path : 'navigation_data'
                    }
                ])
                .session(session)

                const host = accomodation.seller.host_text

                await reservation_dto.validate_reservation_regist_data(host, accomodation)

                if((user.cashInv - reservation_dto.total_price) < 0){
                    return {
                        code : 200,
                        server_state : true,
                        reservation_state : false,
                        cash_state : false
                    }
                }

                // reservation 등록
                const reservation = new Reservation(
                    {
                        seller : accomodation.seller._id,
                        buyer : user._id,
                        navigation_date : accomodation.navigation_data.navigation_data,
                        accomodation : accomodation._id,
                        total_price : reservation_dto.total_price,
                        capacity : reservation_dto.capacity,
                        stay_day : reservation_dto.stay_day,
                        checkin : setHours(reservation_dto.checkin, accomodation.check_time.check_in.time),
                        checkout : setHours(reservation_dto.checkout, accomodation.check_time.check_out.time),
                        final_start_date : addDays(reservation_dto.checkin, -host.before_date.data),
                        final_end_date : addDays(reservation_dto.checkout, host.before_date.data),
                        reservation_state : host.reservation_rule ? 'payment_success' : 'payment_pending',
                        use_state : false,
                        ...(host.reservation_rule && {payment_at: new Date()})
                    }
                )

                await reservation.save({session})

                // massage room 생성 및 초기 host massage 등록
                const message_room = new MessageRoom(
                    {
                        reservation_id : reservation._id,
                        participants : [user._id, accomodation.seller._id],
                        guest_id : user.userId,
                        host_id : accomodation.seller.userId,
                        checkin : reservation.checkin,
                        checkout : reservation.checkout,
                        last_message : host.initial_message,
                        reservation_state : reservation.reservation_state,
                        reservation_main_img : accomodation.main_img,
                        reservation_title : accomodation.title
                    }
                )
                await message_room.save({session})

                const message = new Message(
                    {
                        room_id : message_room._id,
                        sender_id : accomodation.seller._id,
                        content : host.initial_message
                    }
                )
                await message.save({session})

                // 결제
                user.cashInv -= reservation_dto.total_price
                await user.save({session})
                await User.findByIdAndUpdate(
                    accomodation.seller._id,
                    {$inc : {cashInv: reservation_dto.total_price}},
                    {session}
                )

                await session.commitTransaction()
                session.endSession()

                return {
                    code : 200,
                    server_state : true,
                    reservation_state : true,
                    cash_state : true
                }

            }catch(e){
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

module.exports = reservation_regist_service