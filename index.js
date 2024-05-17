const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const config = require('./config')



//////////////////////// 라우터
const userRouter = require('./src/routes/userRt')

//////////////////////////프론트와 포트 연결 설정
const corsOption = {
    origin : '*',
    Credential:true
}

////////////////////////////////db연결
mongoose.connect(config.MONGODB_URL)
.then(() => console.log('DB 연동 성공'))
.catch((e) => console.log(`DB 연동 실패 ${e}`))

//////////////////////////////////공통 미들웨어
app.use(cors(corsOption))
app.use(express.json())
app.use(logger('tiny'))

//////////////////////////////////////라우터 연결
app.use('/api/users', userRouter)

/////////////////////////////////////서버 연결 확인 절차
app.get('/hello', (req, res)=>{
    res.json('hello world')
})
app.get('/error', (req,res)=>{
    throw new Error('에러 발생')
})

/////////////////////콜백 핸들러
app.use((req,res,next)=>{
    res.status(404).send("Sorry can't find pages")          ////요청 페이지 없을 경우
})
app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).send("something is broken server")
})
app.listen(3700, () => {
    console.log('server is running on port 3700')
})