
// 숙소 데이터 제한 쿼리문 작성 컨트롤러
async function acc_limit_controller(req, res, next){
    const limit = parseInt(req.query.limit) || 10

    req.limit_query = limit
    next()
}

module.exports = acc_limit_controller
