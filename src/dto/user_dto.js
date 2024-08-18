
// **********************************************************
// e-mail 형식은 종류가 많고 복잡하므로 express validator로 검사!
class user_dto{
    constructor(data){ 
        this.token = data.token || null
        this.userId = data.userId || null 
        this.password = data.password || null
        this.email = data.email || null
        this.name = data.name || null
        this.isAdmin = data.isAdmin || null
        this.cashInv = data.cashInv || null
        this.profileImg = data.profileImg || null
        this.nickname = data.nickname || null
        this.hostText = data.hostText || null
        this.hostText = data.hostText || null
    }
    // token 타입&형식 검사
    validate_token(){        
        if(this.token){
            if(typeof this.token !== 'string'){
                throw new Error('token 전달 타입이 잘못 되었습니다')
            }
            if(!this.token.startsWith('Bearer ')){
                throw new Error('token 전달 형식이 잘못 되었습니다.')
            }
        }else{
            throw new Error('token data가 없습니다.')
        }
    }
    // id 타입&형식 검사
    validate_id(){
        if(this.userId){
            if(typeof this.userId !== 'string'){
                throw new Error('userId 전달 타입이 잘못 되었습니다')
            }

            const id_rgx = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{7,12}$/
            if(id_rgx.test(this.userId)){
                throw new Error('userId이 형식에 맞지 않습니다.')
            }
        }else{
            throw new Error('token data가 없습니다.')
        }
    }
    
}

module.exports = user_dto
