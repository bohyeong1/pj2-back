const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('../src/config/env_config')
const connect_db = require('../src/config/db_config')

// =================================================
// middlewares //
const error_middle = require('../src/middlewares/error_handle_middle/error_midle')
const notfound_middle = require('../src/middlewares/error_handle_middle/404_midle')


// =================================================
// router //
const userRouter = require('../src/routes/userRt')
const registerRouter = require('../src/routes/registerRt')
const commonRouter = require('../src/routes/commonRt')
const reservRouter = require('../src/routes/reserveRt')
const evaluRouter = require('../src/routes/evaluateRt')

// =================================================
// connect client //
const corsOption = {
    origin : '*',
    Credential:true
}

// =================================================
// connect DB //
connect_db(config.MONGODB_URL)

// =================================================
// common middleware //
app.use(cors(corsOption))
app.use(express.json())
app.use(logger('dev'))

// =================================================
// connect router //
app.use('/api/users', userRouter)
app.use('/api/accomodation', registerRouter)
app.use('/api/common', commonRouter)
app.use('/api/reserv', reservRouter)
app.use('/api/evalu', evaluRouter)



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
app.listen(3700, () => {
    console.log('포트 3700')
})