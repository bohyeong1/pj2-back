const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const accomodationSchema = new Schema({
    main_img:{
        type:String,
        require:true
    },
    img_inv:[
        {   type:String,
            require:true}
    ],
    title:{
        type:String,
        require:true
    },
    cityName:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    adress:{
        type:String,
        require:true
    },
    evalueation:{
        type:Number
    },
    category:{
        type:String,
        require:true
    },
    grade:{
        type:String,
        require:true
    },
    summary : {
        type:String,
        require:true
    },
    keyword:[
        {type:String}
    ],
    base_facility:[
        {name:{type:String, require:true}, quanity:{type:Number, require:true}}
    ],
    service_facility:[
        {type:String, require:true}
    ],
    discount:{
        type:Number
    },
    capacity:{
        type:Number,
        require:true
    }
})

const Accomodation = mongoose.model('Accomodation', accomodationSchema)

module.exports = Accomodation






// const data = {        
//     img_url:'https://cdn.mhns.co.kr/news/photo/202201/520746_630720_356.jpg',
//     img_inv:['https://cdn.mhns.co.kr/news/photo/202201/520746_630720_356.jpg','https://cdn.mhns.co.kr/news/photo/202201/520746_630720_356.jpg','https://cdn.mhns.co.kr/news/photo/202201/520746_630720_356.jpg','https://cdn.mhns.co.kr/news/photo/202201/520746_630720_356.jpg'],
//     title:'제주호텔',
//     cityName:'제주도',
//     price:12000,
//     adress:'대전 둔산동 그린아트',
//     evaluation:4.5,
//     category:'모텔',
//     keyword:['친환경'],
//     grade:3,
//     base_facility:[{name:'침실', quanity:3},{name:'침대', quanity:2},{name:'욕실', quanity:2}],
//     capacity:4,
//     reply:102,
//     service_facility:[{name:'주차장', img:''},{name:'조식', img:''},{name:'와이파이', img:''}],
//     summary : '아늑하고 따듯하고 편안하고 끝내주는 숙소입니다.'
// }