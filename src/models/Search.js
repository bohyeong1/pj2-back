const mongoose = require('mongoose')
const {Schema} = mongoose
const util = require('util')

const searchSchema = new Schema({
    original_word : {
        type : String,
        require : true
    },
    choseong : {
        type : String,
        require : true
    },
    dissembled : {
        type : String,
        require : true
    },
    original_address : {
        type : String,
        require : true
    },
    city : {
        type : String,
        require : true
    },
    click_count : {
        type : Number,
        require : true,
        default : 0
    }
})

const Search = mongoose.model('Search', searchSchema)

module.exports = Search



// const search_script = Search.insertMany([
//     {
//       original_word: '서울시',
//       choseong: 'ㅅㅇㅅ',
//       dissembled: 'ㅅㅓㅇㅜㄹㅅㅣ',
//       original_address: '서울시'
//     },
//     {
//       original_word: '강남구',
//       choseong: 'ㄱㄴㄱ',
//       dissembled: 'ㄱㅏㅇㄴㅏㅁㄱㅜ',
//       original_address: '서울시 강남구'
//     },
//     {
//       original_word: '가로수길',
//       choseong: 'ㄱㄹㅅㄱ',
//       dissembled: 'ㄱㅏㄹㅗㅅㅜㄱㅣㄹ',
//       original_address: '서울시 강남구 가로수길'
//     },
//     {
//       original_word: '서울시 강남구',
//       choseong: 'ㅅㅇㅅ ㄱㄴㄱ',
//       dissembled: 'ㅅㅓㅇㅜㄹㅅㅣ ㄱㅏㅇㄴㅏㅁㄱㅜ',
//       original_address: '서울시 강남구'
//     },
//     {
//       original_word: '보형짱네 집',
//       choseong: 'ㅂㅎㅉㄴ ㅈ',
//       dissembled: 'ㅂㅗㅎㅕㅇㅉㅏㅇㄴㅔ ㅈㅣㅂ',
//       original_address: '서울시 강남구 가로수길 11'
//     }
// ]).then(console.log('search set'))
