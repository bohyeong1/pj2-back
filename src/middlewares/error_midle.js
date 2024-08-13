function error_middle(err,req,res,next){
    console.log(err.stack)
    res.status(500).send("에러 발생")
}

module.exports = error_middle