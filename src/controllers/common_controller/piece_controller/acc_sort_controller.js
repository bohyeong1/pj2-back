
// 숙소 정렬 쿼리문 작성 컨트롤러
async function acc_sort_controller(req, res, next){
    const sort = req.body.sort

    // 정렬 조건 설정
    let sort_query = {}
    if(sort === 'createAt'){
        sort_query = {key:'createAt', direction:-1}
    } 
    else if(sort === 'price%2Fmax'){
        sort_query = {key:'price', direction:-1}
    } 
    else if(sort === 'price%2Fmin'){
        sort_query = {key:'price', direction:1}
    } 
    else if(sort === 'replay%2Fmax'){
        sort_query = {key:'counts_review', direction: -1 }
    } 
    else if(sort === 'evaluation%2Fmax'){
        sort_query = {key:'average', direction:-1}
    }

    req.sort_query = sort_query
    next()
}

module.exports = acc_sort_controller