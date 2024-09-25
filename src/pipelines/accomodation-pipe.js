
// =================================================
// 숙소 평균 평점 & 평점메긴 사람 구하는 파이프라인 //
function accomodation_pipe(){
    return [
        // 댓글 & 숙소 조인
        {
            $lookup:{
                from:'evaluations',
                localField:'_id',
                foreignField:'homeid',
                as:'replys'
            }
        },
        // 평가 컬랙션 evaluation필드만 추출
        {
            $addFields:{
                evaluations:{
                $reduce:{
                    input:'$replys',
                    initialValue:[],
                    in:{$concatArrays:['$$value', '$$this.evaluation']}
                }
                }
            }
        },
        // evaluation 필드 avgGrade값만 추출
        {
            $addFields:{
                filtered_evaluations:{
                $filter:{
                    input:'$evaluations',
                    as:'evaluation',
                    cond:{$eq:['$$evaluation.name', 'avgGrade']}
                }
                }
            }
        },
        // avgGrade에서 grade(평점)만 추출해서 배열ㅇ담기
        {
            $addFields:{
                grades:{
                $map:{
                    input:'$filtered_evaluations',
                    as:'evaluation',
                    in:'$$evaluation.grade'
                }
                }
            }
        },
        // 평균 & 리뷰 단 사람 숫자 집계
        {
            $addFields:{
                average:{$avg:'$grades'},
                counts_review:{$size:'$replys'}
            }
        },

    ]
}

// =================================================
// 정렬 파이프라인 첫번째 정렬 값 null이거나 동일한 값일 시 두번째 정렬 기준 -> 생성 날짜 최신순 //
// sort = 정렬 기준 / directon = 오름차순 or 내림차순 //
function accomodation_sort_pipe(sort, direction){
    return [
        {
            $addFields:{
                sortField:{
                    $cond:{if: {$eq:[`$${sort}`, null]}, then:1, else:0}
                }
            }
        },
        // 첫 번째 정렬 기준과 두 번째 정렬 기준 적용
        // * sort에서는 동적필드 참고할 땐 '$sortField'가 아니라 sortField로 변수 넣듯이 넣을것 문법적 차이 있음
        {
            $sort:{
                sortField:1, // null 값을 마지막으로 배치
                [sort]:direction,
                'createAt': -1 
            }
        },
        // 필요없는 필드 제거
        {
            $project:{
                grades:0,
                filtered_evaluations:0,
                evaluations: 0,
                replys:0
            }
        }]
}

// =================================================
// 숙소 평균 평점 & 평점메긴 사람 구하는 파이프라인 //
function accomodation_get_local_average_pipe(date_range, local){
    return [
        {
            $match : {
                createAt : {$gte : date_range},
                search_adress : local,
                regist_state : true
            }
        },
        {
            // 1개월 단위로 그류핑 후 조건 그류핑
            $group : {
                _id: { month: { $month: "$createAt" } },
                average_price : {$avg: "$price"},
                average_add_price : { $avg: "$addPrice" }
            }
        }
    ]
}

module.exports = {
    accomodation_pipe : accomodation_pipe, 
    accomodation_sort_pipe : accomodation_sort_pipe,
    accomodation_get_local_average_pipe : accomodation_get_local_average_pipe
}

