const async_handler = require('express-async-handler')
const Accomodation = require('../../../models/Accomodation')
const {accomodation_pipe, accomodation_sort_pipe} = require('../../../pipelines/accomodation-pipe')

// 숙소 찾는 메인 컨트롤러
async function acc_subapp_controller(req, res, next){
    const {filter_query, sort_query = null, limit_query, skip_query = 0} = req

    // 최종 파이프라인
    const pipelines = [
        {$match : filter_query},
        ...accomodation_pipe(),
        ...(sort_query ? 
            sort_query.key === 'createAt' ? [{$sort : {'createAt' : -1}}] 
            : accomodation_sort_pipe(sort_query.key, sort_query.direction) : []),
        {$skip : skip_query},
        {$limit : limit_query}
    ]

    try{
        const [total_counts, accomodations] = await Promise.all([
            Accomodation.countDocuments(filter_query),
            Accomodation.aggregate(pipelines)
        ])

        res.json({
            code: 200,
            accomodations,
            total_pages: Math.ceil(total_counts / limit_query),
            total_counts: total_counts
        })
    }catch(e){
        throw new Error(e)
    }
}

module.exports = {
    acc_subapp_controller : async_handler(acc_subapp_controller)
}