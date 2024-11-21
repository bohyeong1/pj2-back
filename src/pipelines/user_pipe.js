
// =================================================
// user message 상대와 나의 메세지들 출력하는 파이프라인 //
function get_processed_messages(self, reservation_id){

    return [
        {
            $match : {
                _id : reservation_id,
                participants : {$in: [self._id]},
            },
        },
        {
            $lookup : {
                from : 'messages',
                localField : '_id',
                foreignField : 'room_id',
                as : 'messages',
            },
        },
        {
            $addFields : {
                messages : {
                    $map : {
                        input : '$messages',
                        as : 'message',
                        in : {
                            $mergeObjects : [
                                '$$message',
                                {
                                    role : {
                                        $cond : [
                                            {$eq : ['$$message.sender_id', self._id]}, 'self', 'other',
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        {
            $addFields : {
                messages : {
                    $sortArray : {
                        input : '$messages',
                        sortBy : {create_at : 1},
                    },
                },
            },
        },
        {
            $addFields : {
                other_participant : {
                    $arrayElemAt : [
                        {
                            $filter : {
                                input : '$participants',
                                as : 'participant',
                                cond : {
                                    $ne : ['$$participant', self._id],
                                },
                            },
                        }, 0,
                    ],
                },
            },
        },
        {
            $lookup : {
                from : 'users',
                localField : 'other_participant',
                foreignField : '_id',
                as : 'other_profile',
            },
        },
        {
            $unwind : {
                path : '$other_profile',
                preserveNullAndEmptyArrays : true,
            },
        },
        {
            $project : {
                participants : 0,
                other_participant : 0,
            },
        },
    ]
}

// =================================================
// user evaluations get pipe line //
function get_user_evaluations(){
    return [
        {
            $lookup : {
                from : 'evaluations',
                localField : '_id',
                foreignField : 'writerid',
                as : 'evaluations'
            }
        },          
        {
            $addFields: {
                evaluations_counts: {$size: '$evaluations'}
            }
        },
        { 
            $unwind : {
                path : '$evaluations', preserveNullAndEmptyArrays : true
            } 
        },
        {
            $lookup : {
                from : 'users',
                localField : 'evaluations.sellerid',
                foreignField : '_id',
                as : 'seller'
            }
        },
        {
            $unwind: {
                path: '$seller'
            }
        },
        {
            $addFields: {
                'evaluations.seller': '$seller'
            }
        },
        {
            $group : {
                _id : '$_id',
                evaluations_counts : {$first : '$evaluations_counts'},
                evaluations : {$push : '$evaluations'}
            }
        }
    ]
}

module.exports = {
    get_processed_messages,
    get_user_evaluations
}
