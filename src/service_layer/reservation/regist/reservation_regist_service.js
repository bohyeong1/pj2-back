const Accomodation = require('../../../models/Accomodation')
const Reservation = require('../../../models/Reservation')
const Hostinformation = require('../../../models/Hostinformation')
const User = require('../../../models/User')
const error_dto = require('../../../dto/error_dto')
const mongoose = require('mongoose')
const config = require('../../../config/env_config')
const {is_valid_user} = require('../../../util_function/util_function')
const {addDays} = require('date-fns')

class reservation_regist_service{
    // =================================================
    // 숙소 예약 등록 //
    async regist_reservation(user_dto, accomodation_dto, reservation_dto){
        user_dto.validate_token()
        accomodation_dto.validate_alter_under_id()
        
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
                    checkin : reservation_dto.checkin,
                    checkout : reservation_dto.checkout,
                    final_start_date : addDays(reservation_dto.checkin, -host.before_date.data),
                    final_end_date : addDays(reservation_dto.checkout, host.before_date.data),
                    reservation_state : 'payment_success',
                    use_state : false
                }
            )

            reservation.save({session})

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
            
            throw new error_dto({
                code: 401,
                message: '인증절차 중 문제가 발생 하였습니다.',
                server_state: false,
                error : e
            })
        }
    }
}

module.exports = reservation_regist_service