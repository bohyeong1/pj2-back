const {Client} = require('redis-om')

let redis_om_client

async function connect_redis_om(){
    if(!redis_om_client){
        redis_om_client = new Client()
    
        try{
            await redis_om_client.open('redis://localhost:6379')
            console.log('Redis OM 연동 성공')          
        }catch(e){
            console.error('Redis OM 연동 실패', e)
        }
    }

    return redis_om_client
}

module.exports = connect_redis_om
