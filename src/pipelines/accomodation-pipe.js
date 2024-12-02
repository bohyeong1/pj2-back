
// =================================================
// 숙소 리스트 평균 평점 & 평가 인원 구하는 파이프라인 //
function accomodation_pipe(){
    return [
        {
            $lookup : {
                from : 'evaluations',
                localField : '_id',
                foreignField : 'homeid',
                as : 'replys'
            }
        },
        {
            $addFields : {
                evaluations : {
                $reduce : {
                    input : '$replys',
                    initialValue : [],
                    in : {$concatArrays:['$$value', '$$this.evaluation']}
                }
                }
            }
        },
        {
            $addFields : {
                filtered_evaluations : {
                $filter : {
                    input : '$evaluations',
                    as : 'evaluation',
                    cond : {$eq : ['$$evaluation.name', 'avgGrade']}
                }
                }
            }
        },
        {
            $addFields : {
                grades : {
                $map : {
                    input : '$filtered_evaluations',
                    as : 'evaluation',
                    in : '$$evaluation.grade'
                }
                }
            }
        },
        {
            $addFields : {
                average : {$avg : '$grades'},
                counts_review : {$size : '$replys'}
            }
        },

    ]
}

// =================================================
// 정렬 파이프라인 첫번째 정렬 값 null이거나 동일한 값일 시 두번째 정렬 기준 -> 생성 날짜 최신순 //
// sort = 정렬 기준 / directon = 오름차순 or 내림차순 //
function accomodation_sort_pipe(key){
    let sort
    let direction
    switch(key){
        case 'createAt' :
            sort = 'createAt'
            direction = -1
            break
        
        case 'price/max' :
            sort = 'price'
            direction = -1
            break
            
        case 'price/min' :
            sort = 'price'
            direction = 1
            break

        case 'replay/max' :
            sort = 'counts_review'
            direction = -1
            break

        case 'evaluation/max' :
            sort = 'average'
            direction = -1
            break
    }

    return [
        {
            $addFields : {
                sortField : {
                    $cond : {if: {$eq:[`$${sort}`, null]}, then:1, else:0}
                }
            }
        },
        {
            $sort : {
                sortField : 1,
                ...(sort !== 'createAt' && {[sort] : direction}),
                'createAt' : -1 
            }
        },
        {
            $project : {
                grades : 0,
                filtered_evaluations : 0,
                evaluations : 0,
                replys : 0
            }
        }]
}

// =================================================
// 상세 숙소 평균 평점 & 평가 인원 구하는 파이프라인 //
function get_detail_evaluation(){
    return [
        {
            $facet : {
                // 댓글 원본
                reply_facet : [
                    {
                        $lookup : {
                            from : 'users',             
                            localField : 'writerid', 
                            foreignField : '_id',       
                            as : 'user_information'     
                        }
                    },
                    {
                        $group : {
                            _id : null,
                            reply : {$push : '$$ROOT'},
                            total_counts : {$sum : 1 }
                        }
                    },
                    {
                        $project : {
                            _id : 0,
                            reply : 1,
                            total_counts : 1
                        }
                    }
                ],
                // 평가, 각각 데이터
                evaluation_facet : [
                    {$unwind : '$evaluation'},
                    {$match : {'evaluation.name' : {$exists: true, $ne: null}}},
                    {
                        $group : {
                            _id : '$evaluation.name',
                            avg : {$avg : '$evaluation.grade'},
                            url : {$first : '$evaluation.url'},
                            title : {$first : '$evaluation.title'}
                        }
                    },
                    {
                        $group : {
                            _id : null,
                            evaluations : {
                                $push : {
                                    k : '$_id',
                                    v : {
                                        avg : '$avg',
                                        url : '$url',
                                        title : '$title'
                                    }
                                }
                            }
                        }
                    },
                    {
                        $addFields : {
                            evaluations : {$arrayToObject: '$evaluations'}
                        }
                    },
                    {
                        $project : {
                            _id : 0,
                            evaluations : 1
                        }
                    }
                ],
                // 점수 별 통계
                score_group_facet : [
                    {$unwind : '$evaluation'},
                    {
                        $match : {
                            'evaluation.name' : {$ne : 'avgGrade'}
                        }
                    },
                    {
                        $group : {
                            _id : '$evaluation.grade',
                            count : {$sum: 1}
                        }
                    },
                    {
                        $sort : {_id: 1} 
                    },
                    {
                        $group : {
                            _id : null,
                            score_groups : {$push : {grade : '$_id', count : '$count'}},
                            total_count : {$sum : '$count'} 
                        }
                    }
                ]
            }
        },
        {
            $project : {
                reply : {$arrayElemAt : ['$reply_facet.reply', 0]},
                total_counts : {$arrayElemAt : ['$reply_facet.total_counts', 0]},
                evaluations : {$arrayElemAt : ['$evaluation_facet.evaluations', 0]},
                score_groups : {$arrayElemAt : ['$score_group_facet.score_groups', 0]},
                total_score_count : {$arrayElemAt : ['$score_group_facet.total_count', 0]}
            }
        }
    ]
}

// =================================================
// 숙소 date filtering 파이프라인 //
function accomodation_get_possible_date_pipe(checkin, checkout){
    return [
        {
            $addFields : {
                checkin : new Date(checkin),
                checkout : new Date(checkout)
            },

        },
        {
            $lookup : {
                from : 'reservations',
                let : { 
                    accommodationId : '$_id', 
                    checkin : '$checkin', 
                    checkout : '$checkout' 
                },
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $and : [
                                    {$eq : ['$accomodation', '$$accommodationId']},
                                    {$lt : ['$final_start_date', '$$checkout']},
                                    {$gt : ['$final_end_date', '$$checkin']}
                                ]
                            }
                        }
                    }
                ],
                as: 'filtering_accomodations'
            }
        },
        {
            $match : {
                'filtering_accomodations.0' : {$exists: false}
            }
        },
        {
            $project : {
                filtering_accomodations : 0,
                checkin : 0,
                checkout : 0
            }
        }
    ]
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
                _id: { month: { $month: '$createAt' } },
                average_price : {$avg: '$price'},
                average_add_price : { $avg: '$addPrice' }
            }
        }
    ]
}

module.exports = {
    accomodation_pipe, 
    accomodation_sort_pipe,
    accomodation_get_local_average_pipe,
    get_detail_evaluation,
    accomodation_get_possible_date_pipe
}

