const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const categorySchema = new Schema({
    cityName : {
        type:String,
        require:true
    },
    main_img : {
        type : String
    },
    count : {
        type : Number,
        require : true
    }
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category





// //////////////////////지역 카테고리 분류 -> 추후 관리자 페이지로 뺄것
// const cityname = ['제주도', '서울', '대전', '부산', '대구','울산', '인천', '경주']
// const imgUrls = ['https://dimg04.c-ctrip.com/images/1mj3s12000atjxjluA03C_Z_640_10000_R5.png_.webp?proc=autoorient&proc=source%2ftrip', 'https://mediahub.seoul.go.kr/wp-content/uploads/editor/images/000091/%EC%9A%B0%EC%88%98%EC%83%81_%EC%9E%84%EA%B4%91%EC%97%BD.jpg'
// ,'https://www.kkday.com/ko/blog/wp-content/uploads/korea_daejeon_sikjangsan_2.jpg', 'https://goguides.azureedge.net/media/1shokobx/c1bcd124-0431-4f9d-9816-9488cd033171.jpg?anchor=center&mode=crop&width=1600&height=1066&quality=50'
// ,'https://www.kukinews.com/data/kuk/image/2021/07/04/kuk202107040021.680x.0.jpg','https://previews.123rf.com/images/4045qd/4045qd1708/4045qd170800586/84249673-%ED%8F%AD%ED%8F%AC%EC%9D%98-%EC%9E%90%EC%97%B0-%ED%92%8D%EA%B2%BD-%EA%B2%BD%EC%B9%98%EB%B3%B4%EA%B8%B0.jpg'
// ,'https://kr.xinhuanet.com/2015-05/08/134218878_14309895684221n.jpg','https://kr.xinhuanet.com/2015-05/08/134218878_14309895684321n.jpg']

// for(let i = 0; i<cityname.length; i++){
//     const categories = new Category({
//         cityName : cityname[i],
//         main_img : imgUrls[i]
//     })
//     categories.save().then(()=>{console.log('지역 등록 완료')})
// }