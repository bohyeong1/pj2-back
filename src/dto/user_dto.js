
// ***********************************************************
// e-mail 형식은 종류가 많고 복잡하므로 express validator로 검사!
class user_dto{
    constructor(data){ 
        // 구현
        this.token = data.token || null
        this.userId = data.userId || null 
        this.password = data.password || null
        this.password_confirm = data.password_confirm || null
        this.email = data.email || null
        this.name = data.name || null
        // 아직 폼 타입검사 미구현
        this.isAdmin = data.isAdmin || null
        this.cashInv = data.cashInv || null
        this.profileImg = data.profileImg || null
        this.nickname = data.nickname || null
        this.hostText = data.hostText || null
        this.hostText = data.hostText || null
    }

    // =================================================
    // token 형식 & 타입검사 //
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

    // =================================================
    // id 타입 & 형식검사 //
    validate_id(){
        if(!this.userId){
            throw new Error('userId data가 없습니다.')
        }
        if(typeof this.userId !== 'string'){
            throw new Error('userId  타입이 잘못 되었습니다.')
        }
        const id_rgx = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{7,12}$/
        if(!id_rgx.test(this.userId)){
            throw new Error('아이디는 7~12자 + 알파벳(+숫자)으로 구성되어야 됩니다.')
        }
    }

    // =================================================
    // password type & form 체크 //
    validate_password(){
        if(!this.password){
            throw new Error('password data가 없습니다.')
        }
        if(typeof this.password !== 'string'){
            throw new Error('password type이 잘못되었습니다.')
        }
        const password_rgx =  /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/
        if(!password_rgx.test(this.password)){
            throw new Error('비밀번호는 8~15자 + 최소 한개의 특수문자를 포함하여야 합니다.')
        }
    }

    // =================================================
    // 비밀번호 확인 type & form 체크 //
    validate_password_confirm(){
        if(!this.password_confirm){
            throw new Error('password_confirm data가 없습니다.')
        }
        if(typeof this.password_confirm !== 'string'){
            throw new Error('password_confirm type이 잘못되었습니다.')
        }
        if(this.password_confirm !== this.password){
            throw new Error('비밀번호 확인이랑 비밀번호를 일치하지 않스빈다.')
        }
    }

    // =================================================
    // name type & form 체크 //
    validate_name(){
        if(!this.name){
            throw new Error('name data가 없습니다.')
        }
        if(typeof this.name !== 'string'){
            throw new Error('name type이 잘못되었습니다.')
        }
        const name_rgx = /^[가-힣a-zA-Z]{1,20}$/
        if(!name_rgx.test(this.name)){
            throw new Error('이름은 1~20자 영어 또는 한글로 작성되어야 합니다.')
        }
    }

    // =================================================
    // 초기 회원가입 id & password & name 타입 & 형식검사 //
    validate_initial_join(){
        if (!this.userId || !this.password || !this.name) {
            throw new Error('회원가입에 필요한 데이터가 없습니다. userId, password, name이 필요합니다.');
        }
        // id 타입 & 형식 검사
        this.validate_id()
        // 비밀번호 타입 형식검사
        this.validate_password()
        // 비밀번호 확인 타입 형식검사
        this.validate_password_confirm()
        // 이름 타입 형식검사
        this.validate_name()
    }    
}

module.exports = user_dto
