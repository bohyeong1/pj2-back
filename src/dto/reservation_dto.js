const error_dto = require('../dto/error_dto')
const Reservation = require('../models/Reservation')
const mongoose = require('mongoose')
const {check_object, check_string, check_array, check_integer, check_date} = require('../util_function/util_function')
const _ = require('lodash')
const {isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, isAfter, addMonths, isToday} = require('date-fns')

class reservation_dto{
    constructor(data){ 
        this._id = data._id || null
        this.total_price = data.total_price || null
        this.capacity = data.capacity || null
        this.checkin = data.checkin || null
        this.checkout = data.checkout || null
        this.stay_day = data.stay_day || null
        this.type = data.type || null
    }

    // =================================================
    // validate reservation type 형식 & 타입검사 //
    validate_reservation_type(){
        if(this.type){
            if(!check_string(this.type)){
                throw new error_dto({
                    code: 400,
                    message: 'type data가 유효한 타입이 아닙니다.',
                    server_state: false
                })
            }

            if(this.type !== 'guest' && this.type !== 'host'){
                throw new error_dto({
                    code: 400,
                    message: 'type data가 유효한 형식이 아닙니다.',
                    server_state: false
                })
            }
        }
        else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // validate reservation regist data 형식 & 타입검사 //
    async validate_reservation_regist_data(host, accomodation){     
        if(this.total_price && this.capacity && this.checkin && this.checkout && host && accomodation){
            const self = this
            const reservation_list = await Reservation.find(
                {seller : host.host}
            )

            // check capacity
            if(!check_integer(this.capacity) || this.capacity <= 0 || this.capacity > accomodation.capacity){
                throw new error_dto({
                    code: 400,
                    message: 'capacity가 유효한 타입, 형식이 아닙니다.',
                    server_state: false
                })
            }

            // check stay day
            if(!check_integer(this.stay_day) || this.stay_day > host.max_reservation_date || this.stay_day < host.min_reservation_date){
                throw new error_dto({
                    code: 400,
                    message: 'stay_day 유효한 타입, 형식이 아닙니다.',
                    server_state: false
                })
            }

            // check check in date
            function is_duplicated_date(date){
                let duplicate_state
                if(reservation_list.length){
                    duplicate_state = !_.every(reservation_list, (el) => {
                        return !isWithinInterval(date, {start : el.final_start_date, end : el.final_end_date})
                    })
                }else{
                    duplicate_state = false
                }

                return duplicate_state
            }
            
            function is_valid_checkin(date){
                const now_time = new Date()
                const target_time = setMilliseconds(setSeconds(setMinutes(setHours(new Date(), host.reservation_deadline.data), 0), 0), 0)
                const deadline_date = addMonths(now_time, 3)
                if(isToday(date) && isAfter(now_time, target_time)){
                    return false
                }
                if(isAfter(date, deadline_date)){
                    return false
                }
                return true
            }

            if(is_duplicated_date(this.checkin) || !check_date(this.checkin) || !is_valid_checkin(this.checkin)){
                throw new error_dto({
                    code: 400,
                    message: 'checkin 유효한 타입, 형식이 아닙니다.',
                    server_state: false
                })
            }

            // check check out date
            function is_valid_checkout(date){
                const now_time = new Date()
                const deadline_date = addMonths(now_time, 3)
                if(isAfter(date, deadline_date)){
                    return false
                }
                return true
            }

            if(is_duplicated_date(this.checkout) || !is_valid_checkout(this.checkout)){
                throw new error_dto({
                    code: 400,
                    message: 'checkout 유효한 타입, 형식이 아닙니다.',
                    server_state: false
                })
            }

            // check total price
            function is_valid_total_price(){
                let calculate_price = null
                const add_capacity = self.capacity - 1
                const discount = accomodation.discount ? accomodation.discount : null
                
                if(discount && self.stay_day >= discount.date.date){
                    calculate_price = (accomodation.price + add_capacity * accomodation.addPrice) * self.stay_day * (100 - discount.rate) / 100
                }
                else{
                    calculate_price = (accomodation.price + add_capacity * accomodation.addPrice) * self.stay_day
                }

                return calculate_price === self.total_price
            }

            if(!check_integer(this.total_price) || this.total_price <= 0 || !is_valid_total_price()){
                throw new error_dto({
                    code: 400,
                    message: 'total_price가 유효한 타입, 형식이 아닙니다.',
                    server_state: false
                })
            }

        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }

    // =================================================
    // _id 형식 & 타입검사 & objectId 타입 변환 //
    validate_alter_under_id(){
        if(this._id){
            if(!check_string(this._id)){
                throw new error_dto({
                    code: 400,
                    message: '_id 전달 타입이 잘못 되었습니다',
                    server_state: false
                })
            }
            try{
                this._id = new mongoose.Types.ObjectId(this._id)
            }catch(e){
                throw new error_dto({
                    code: 400,
                    message: '_id가 유효한 ObjectId 형식이 아닙니다.',
                    server_state: false
                })
            }
        }else{
            throw new error_dto({
                code: 400,
                message: 'client의 data가 제대로 전송되지 않았습니다.',
                server_state: false
            })
        }
    }
}

module.exports = reservation_dto
