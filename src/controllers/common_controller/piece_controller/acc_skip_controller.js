
// 숙소 페이지 네이션 이동 쿼리문 작성 컨트롤러
async function acc_skip_controller(req, res, next){
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * 10
    req.skip_query = skip
    next()
}

module.exports = acc_skip_controller