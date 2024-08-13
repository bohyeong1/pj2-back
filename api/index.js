const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('../src/config/env_config')
const connect_db = require('../src/config/db_config')

//////////////////////// midlewares
const error_middle = require('../src/middlewares/error_midle')
const notfound_middle = require('../src/middlewares/404_midle')


//////////////////////// 라우터
const userRouter = require('../src/routes/userRt')
const registerRouter = require('../src/routes/registerRt')
const commonRouter = require('../src/routes/commonRt')
const reservRouter = require('../src/routes/reserveRt')
const evaluRouter = require('../src/routes/evaluateRt')

//////////////////////////프론트와 포트 연결 설정
const corsOption = {
    origin : '*',
    Credential:true
}

////////////////////////////////db연결
connect_db(config.MONGODB_URL)

//////////////////////////////////공통 미들웨어
app.use(cors(corsOption))
app.use(express.json())
app.use(logger('dev'))

//////////////////////////////////////라우터 연결
app.use('/api/users', userRouter)
app.use('/api/accomodation', registerRouter)
app.use('/api/common', commonRouter)
app.use('/api/reserv', reservRouter)
app.use('/api/evalu', evaluRouter)



/////////////////////////////////////서버 연결 확인
app.get('/hello', (req, res)=>{
    res.json('hello world')
})
app.get('/error', (req,res)=>{
    throw new Error('에러 발생')
})

////////////////////////////////// 404 & error처리 미들웨어 등록
app.use(notfound_middle)
app.use(error_middle)

/////////////////////local port
app.listen(3700, () => {
    console.log('포트 3700')
})