const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const config = require('../src/config/env_config')
const connect_db = require('../src/config/db_config')
const cookie_parser = require('cookie-parser')
const fs = require('fs')
const https = require('https')
const path = require('path')
const connect_redis_om = require('../src/config/redis_om_config')
const get_suggestion_repository = require('../src/config/suggestion_repository_config')
const {
    store_search_data,
    create_part_keywords,
    split_road_adress
} = require('../src/util_function/search_function')

// =================================================
// middlewares //
const error_middle = require('../src/middlewares/error_handle_middle/error_midle')
const notfound_middle = require('../src/middlewares/error_handle_middle/404_midle')

// =================================================
// router //
const user_router = require('../src/routes/user_router')
const register_router = require('../src/routes/accomodation_router')
const common_router = require('../src/routes/common_router')
const reservation_router = require('../src/routes/reservation_router')
const evaluation_router = require('../src/routes/evaluate_router')

// =================================================
// https options //
const options = {
    key : fs.readFileSync(path.join(__dirname, '../key.pem')),
    cert : fs.readFileSync(path.join(__dirname, '../cert.pem'))
}

// =================================================
// connect client //
const cors_option = {
    origin: 'https://localhost:5000',
    credentials : true
}

// =================================================
// 프리플라이트 옵션 설정 //
app.options('*', cors(cors_option))

// =================================================
// connect DB //
connect_db(config.MONGODB_URL)

// =================================================
// common middleware //
app.use(cors(cors_option))
app.use(express.json())
app.use(logger('dev'))
app.use(cookie_parser())

// =================================================
// connect redis //
async function connect_redis(){
    await connect_redis_om()

    // const suggestion_data1 = create_part_keywords(split_road_adress('서울시 강남구 가로수길 5', '가로수집', '서울'))
    // const suggestion_data2 = create_part_keywords(split_road_adress('제주특별자치도 제주시 제주대학로 21-1', '제주 흑돼지집', '제주도'))
    // const suggestion_data3 = create_part_keywords(split_road_adress('대전 동구 대전로316번길 201', '식장산 월출봉', '대전'))

    // await store_search_data(suggestion_data1, '서울')
    // await store_search_data(suggestion_data2, '제주도')
    // await store_search_data(suggestion_data3, '대전')
}
connect_redis()

// =================================================
// connect router //
app.use('/api/users', user_router)
app.use('/api/accomodation', register_router)
app.use('/api/common', common_router)
app.use('/api/reservation', reservation_router)
app.use('/api/evalu', evaluation_router)

// =================================================
// test server //
app.get('/hello', (req, res)=>{
    res.json('hello world')
})
app.get('/error', (req,res)=>{
    throw new Error('에러 발생')
})

// =================================================
// connect error_middlewares //
app.use(notfound_middle)
app.use(error_middle)

// =================================================
// local port //
https.createServer(options, app).listen(3700, () => {
    console.log('HTTPS 포트 3700')
})