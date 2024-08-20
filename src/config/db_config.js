const mongoose = require('mongoose')

function connect_db(url){
    mongoose.connect(url)
    .then(() => console.log('DB 연동 성공!'))
    .catch((e) => console.log(`DB 연동 실패 ${e}`))
}
module.exports = connect_db


