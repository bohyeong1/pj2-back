function notfound_middle(req,res,next){
    res.status(404).send("낫파운드 페이지")          ////요청 페이지 없을 경우
}

module.exports = notfound_middle