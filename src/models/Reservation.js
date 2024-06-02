const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const reservaitonSchema = new Schema({
    /////////////제목
    title:{
        type:String, maxlength:20
    },
    ////이미지 메인&서브로 분할
    main_img:{
        type:String
    }, 

    ////////////판매자
    seller:{
        type:ObjectId,
        require:true,
        ref:'User'
    },

    // ///////구매자
    buyer:[{
        type:ObjectId,
        ref:'User'
    }],  

    ////////////해당숙소
    accomodation:{
        type:ObjectId,
        ref:'Accomodation'
    },

    // 도시 분류   /////////프론트에선 서브 어드레스 위도경도로 주소정보 보여주기 ㅇ
    main_adress:{
        name:{type:String},
        coor:[{type:Number}]
    },
    sub_adress:{
        name:{type:String},
        coor:[{type:Number}]
    },   

    ////////숙소 카테고리
    category:{
        name:{
            type:String
        },
        url:{
            type:String
        }
    },   
    
    ////////최종가격
    totalPrice:{
        type:Number
    },

    // ////수용 인원
    capacity:{
        type:Number
    },

    /////////1박당 가격
    price:{
        type:Number
    },

    //////////////숙박일수
    restDay:{
        type:Number
    },


    // //////////숙소설명
    summary : {
        type:String,
        maxlength:400
    },

    // ///////////숙소 이용규칙
    rules:   
        {require:true,
            type:Array,
        default :       
            [{name:'animal',
            text:'반려동물 동반 가능',
            state:false,
            count:0},

            {name:'event',
            text:'이벤트 허용',
            state:false},

            {name:'vaping',
            text:'흡연, 베이핑, 전자담배 허용',
            state:false},

            {name:'recoding',
            text:'상업적 사진 및 동영상 촬영 허용',
            state:false},

            {name:'addrule',
            text:'추가 규칙',
            state:false,
            summary:''}]
        },
})

const Reservaiton = mongoose.model('Reservation', reservaitonSchema)

module.exports = Reservaiton