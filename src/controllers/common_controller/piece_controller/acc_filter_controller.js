// =================================================
// 숙소 필터 쿼리문 작성 컨트롤러 //

async function acc_filter_controller(req, res, next){
    const city = {search_adress: req.body.city}
    const filters = req.body.filters
    req.filter_query = {...city, ...filters}
    next()
}

module.exports = acc_filter_controller



