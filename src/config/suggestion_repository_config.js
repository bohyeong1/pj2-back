const { Schema } = require('redis-om')
const connect_redis_om = require('./redis_om_config')

let suggestion_repository 
let city_repostitory

// =================================================
// 스키마 정의 //
const suggestion_schema = new Schema('Suggestion', {
    original_word : {type : 'string', sortable : false},
    choseong : {type : 'text', sortable : false},
    dissembled : {type : 'text', sortable : false},
    original_address : {type : 'string', sortable : false},
    city : {type : 'string', sortable : false}
})

const city_schema = new Schema('City', {
    name : {type : 'text', sortable : false},
    count : {type : 'number', sortable : false}
})

// =================================================
// 검색어 저장소 생성 //
async function get_suggestion_repository(){
    if(!suggestion_repository){
        const client = await connect_redis_om()
        suggestion_repository = client.fetchRepository(suggestion_schema)
        await suggestion_repository.createIndex()
    }

    return suggestion_repository
}

// =================================================
// 도시 분류 저장소 생성 //
async function get_city_repository(){
    if(!city_repostitory){
        const client = await connect_redis_om()
        city_repostitory = client.fetchRepository(city_schema)
        await city_repostitory.createIndex()
    }

    return city_repostitory
}

module.exports = {
    get_suggestion_repository,
    get_city_repository
}
