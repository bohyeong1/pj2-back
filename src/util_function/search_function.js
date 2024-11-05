const Hangul = require('hangul-js')
const {get_suggestion_repository, get_city_repository} = require('../config/suggestion_repository_config')

// =================================================
// 도로명 주소 split //
function split_road_adress(adress, title, city){

    // 주소 로직
    const filtered_adress = adress.split(' ')
    const original_address = [...filtered_adress]
    filtered_adress.pop()

    // ex. 대전 동구, 서울시 강남구 등은 검색어 추가
    const find_gu = filtered_adress.filter((el)=>{
        const processed_words = el.split('')
        return processed_words[processed_words.length - 1] === '구'
    })

    if(find_gu.length){
        const add_adress = adress.split('구 ')[0] + '구'
        filtered_adress.push(add_adress)
    }

    return {
        filtered_adress : [...filtered_adress, title + '*'],
        original_address : original_address,
        city : city
    }
}

// =================================================
// split된 검색어, 부분 추출해서 검색어 만들기 //
function create_part_keywords(search_object){  

    const result = search_object.filtered_adress.map((el) => {

        const processed_words = el.includes('*') ? el.slice(0, -1).split('') : el.split('')

        // 초성별
        const initial_words = processed_words
            .map((ele) => {
                return Hangul.disassemble(ele)[0]
            })
            .join('')
    
        // 단어별
        const splited_word = Hangul.disassemble(processed_words).join('')

        // 프론트에서 작게 보여줄 원본 주소
        let original_address

        if(!el.includes('*')){
            if(el.includes(' ')){
                original_address = el
            }else{
                const index = search_object.original_address.indexOf(el)
                original_address = search_object.original_address.slice(0, index + 1).join(' ')
            }
        } 
        else{
            original_address = search_object.original_address.join(' ')
        }
    
        return {
            original_word : el.includes('*') ? el.slice(0, -1) : el,
            choseong : initial_words,
            dissembled : splited_word,
            original_address : original_address,
            city : search_object.city
        }
    })

    return result
}

// =================================================
// redis에 검색어 저장하기 //
async function store_search_data(suggestions, city) {
    const suggestion_repository = await get_suggestion_repository()
    const city_repository = await get_city_repository()

    // 검색어 저장
    for(const suggestion_data of suggestions){
        const suggestion_save = {
            original_word : suggestion_data.original_word,
            choseong : suggestion_data.choseong,
            dissembled : suggestion_data.dissembled,
            original_address : suggestion_data.original_address,
            city : suggestion_data.city
        }

        await suggestion_repository.save(suggestion_save)

        console.log('검색어 저장 완료')
    }

    // 도시 저장
    const city_data = await city_repository.search()
    .where('name')
    .matches(city)
    .returnFirst()

    if(!city_data){
        const city_save = {
            name : city,
            count : 0
        }

        await city_repository.save(city_save)
    }
}

// =================================================
// input data 초성인지 check //
function is_choseong(input) {
    const pattern = /^[ㄱ-ㅎ]+$/
    return pattern.test(input)
}

// =================================================
// redis에서 검색어 출력하기 //
async function get_search_data(input) {
    const suggestion_repository = await get_suggestion_repository()
    let result = []

    // 초성 검색
    if(is_choseong(input)){     
        if(input.length < 3){
            result = await suggestion_repository.search()
            .where('choseong')
            .matches(`*${input}*`)
            .returnAll()
        }
        else{
            result = await suggestion_repository.search()
            .where('choseong')
            .matches(`${input}`)
            .returnAll()
        }   
    }
    else{
        const dissembled_input = Hangul.disassemble(input).join('')

        if(dissembled_input.length < 5){
            result = await suggestion_repository.search()
            .where('dissembled')
            .matches(`*${dissembled_input}*`)
            .returnAll()
        }
        else{
            result = await suggestion_repository.search()
            .where('dissembled')
            .matches(`${dissembled_input}*`)
            .returnAll()
        }

    }

    return result.slice(0,20).map(result => ({
        original_word : result.original_word,
        original_address : result.original_address,
    }))
}

// =================================================
// redis에서 검색어 삭제하기 //
async function delete_search_data() {
    const suggestion_repository = await get_suggestion_repository()

    const suggestions = await suggestion_repository.search().returnAll()

    for(const suggestion of suggestions){
        const symbol_id = Object.getOwnPropertySymbols(suggestion).find(el => el.toString().includes('entityId'))
        const entity_id = suggestion[symbol_id]
        await suggestion_repository.remove(entity_id)
    }

    console.log('모든 검색어 데이터가 삭제되었습니다.')
}
// delete_search_data()

// =================================================
// redis에서 검색어 확인하기 //
async function get_all_suggestions() {
    const suggestion_repository = await get_suggestion_repository()
    const city_repository = await get_city_repository()

    const suggestions = await suggestion_repository.search().returnAll()
    const citys = await city_repository.search().returnAll()

    return {
        suggestions,
        citys
    }
}
// get_all_suggestions().then(result => {
//     console.log('저장된 검색어 데이터:', result);
// }).catch(err => {
//     console.error('데이터 조회 중 오류 발생:', err);
// })

module.exports = {
    split_road_adress,
    create_part_keywords,
    store_search_data,
    get_search_data,
    get_all_suggestions,
    delete_search_data
}