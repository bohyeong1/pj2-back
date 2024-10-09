const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema


const accomodationSchema = new Schema({
    //판매자
    seller : {
        type : ObjectId,
        require : true,
        ref : 'User'
    },
    //구매자
    buyer : {
        type : ObjectId,
        ref : 'User'
    },
    //제목
    title : {
        type : String, maxlength : 20
    },
    //이미지 메인&서브로 분할
    main_img : {
        type : String
    },
    sub_img : [
        {type : String}
    ],
    //주소 메인&서브로 분할 메인주소 => 서브주소까지는 예약 확정된 후 보여주기
    //검색 필드 => 검색창에서 사용할 키워드
    //도시 분류   
    main_adress : {
        name : {type : String},
        coor : [{type : Number}]
    },
    sub_adress : {
        name : {type : String},
        coor : [{type : Number}]
    },
    search_adress : {
        type : String
    },
    navigation_data : {
        type : ObjectId,
        ref : 'Path'
    },
    distance_information : {
        type : Object
    },
    custom_navigation : {
        type : ObjectId,
        ref : 'CustomPath'
    },
    //숙소 카테고리
    category : {
        name : {
            type : String
        },
        url : {
            type : String
        }
    },
    //가격
    price : {
        type : Number
    },
    addPrice : {
        type : Number
    },
    ///평가
    evalueation : {
        type : Number
    },
    //공간 카테고리
    space_category : {
        name : {
            type : String
        },
        url : {
            type : String
        }
    },
    //기본 시설
    base_facility : [
        {name : {type : String}, counts : {type : Number}, url : {type : String}}
    ],
    //서비스 시설
    service_facility : [
        {name : {type : String}, url : {type : String}}
    ],
    // 키워드 
    keywords : [
        {name : {type : String}, url : {type : String}}
    ],
    //수용 인원
    capacity : {
        type : Number
    },
    //숙소설명
    summary : {
        type : String,
        maxlength : 400
    },
    //숙소 이용규칙
    rules :   
        {require : true,
            type : Array,
        default :       
            [{name : 'animal',
            text : '반려동물 동반 가능',
            state : false,
            count : 0},

            {name : 'event',
            text : '이벤트 허용',
            state : false},

            {name : 'vaping',
            text : '흡연, 베이핑, 전자담배 허용',
            state : false},

            {name : 'recoding',
            text : '상업적 사진 및 동영상 촬영 허용',
            state : false},

            {name : 'addrule',
            text : '추가 규칙',
            state : false,
            summary : ''}]
        },
    // check-in, out time
    check_time : {
        check_in : {
            time : {
                type : Number,
                default : 15,
                min : 8,
                max : 22
            },
            name : {
                type : String,
                default : '오후 3시'
            }
        },
        check_out : {
            time : {
                type : Number,
                default : 17,
                min : 10,
                max : 24
            },
            name : {
                type : String,
                default : '오후 5시'
            }
        }
    },
    // 체크인, 아웃 방법
    check_method : {
        check_in : {
            name : {
                type : String
            },
            text : {
                type : String
            },
            url : {
                type : String
            }
        },
        check_out : {
            name : {
                type : String
            },
            text : {
                type : String
            },
            url : {
                type : String
            }
        }
    },
    // wifi information
    wifi_information : {
        name : {
            type : String
        },
        password : {
            type : String
        }
    },
    // manual
    manual : {
        type : ObjectId,
        ref : 'Manual'
    },
    // comunication
    comunication : {
        name : {
            type : String
        }
    },
    //숙소 할인
    discount : {
        date : {
            name : {type : String},
            date : {type : Number}
        },
        rate : {
            type : Number
        }
    },
    //호스팅날짜
    createAt : {
        type : Date,
        default : Date.now
    },
    lastModifiedAt : {
    type : Date,
    default : Date.now
    },
    // 숙소 평점
    avgEvaluation : [
        {type : Number}
    ],
    // 등록 완료 & 미완료
    regist_state : {
        type : Boolean,
        require : true,
        default : false  
    },
    // 현재 업데이트 단계
    acc_step : {
        type : Number,
        require : true,
        default : 0
    }
})

const Accomodation = mongoose.model('Accomodation', accomodationSchema)

module.exports = Accomodation
