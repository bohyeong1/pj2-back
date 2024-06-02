//숙소평가

const express = require('express')
const router = express.Router()

router.get('/', (req,res,next)=>{
    res.json('연동완료')
})

module.exports = router