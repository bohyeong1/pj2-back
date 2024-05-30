const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema


// subDocuments
// aaa : [Rule] 형태로 넣을것
// const Rule = new Schema({
//     name: { type: String },
//     text: { type: String },
//     state: { type: Boolean, default: false },
//     count: { type: Number, default: 0 },
//     summary: { type: String, default: '' }
// })

const accomodationSchema = new Schema({
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

    /////////////제목
    title:{
        type:String, maxlength:20
    },
    ////이미지 메인&서브로 분할
    main_img:{
        type:String
    },
    sub_img:[
        {type:String}
    ],


    ////주소 메인&서브로 분할 메인주소 => 필터에서 분류할때 필요함
    // 도시 분류   
    main_adress:{
        type:String
    },
    sub_adress:{
        type:String
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

    ///가격
    price:{
        type:Number
    },

    ///평가
    evalueation:{
        type:Number
    },

    /////////공간 카테고리
    space_category:{
        name:{
            type:String
        },
        img:{
            type:String
        }
    },

    ///////기본 시설
    base_facility:[
        {name:{type:String}, quanity:{type:Number}, img:{type:String}}
    ],

    // /////////////서비스 시설
    service_facility:[
        {name:{type:String}, img:{type:String}}
    ],

    // /////////// 키워드 
    keywords:[
        {name:{type:String}, img:{type:String}}
    ],

    // ////수용 인원
    capacity:{
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

    ////숙소 할인
    discount:{
        type:Number
    },

    /////////////판매 완료, 미완료 상태
    sellState:{
        type:Boolean,
        default:false,
        require:true
    }

})

const Accomodation = mongoose.model('Accomodation', accomodationSchema)

module.exports = Accomodation
