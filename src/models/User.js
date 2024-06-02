const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const userSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    userId:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    lastModifiedAt:{
        type:Date,
        default:Date.now()
    },
    cashInv:{
        type:Number,
        default:2000000
    },
    profileImg:{
        type:String,
        default:''
    }
})


////////////////user data DB단계 검증
userSchema.path('email').validate(function(value){
    return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
  }, 'email `{VALUE}` 는 잘못된 이메일 형식입니다.')
  
  // 숫자, 특수문자 최소 1개 포함하기 (7~15자)
  userSchema.path('password').validate(function(value){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*\.]{7,15}$/.test(value)
  }, 'password `{VALUE}` 는 잘못된 비밀번호 형식입니다.')
  /////////////////////////////사용자 아이디 검증
  userSchema.path('userId').validate(function(value){
    return/[a-zA-Z1-9]{7,12}/.test(value)
  },'userId `{VALUE}`는 잘못된 아이디 형식입니다.')


const User = mongoose.model('User', userSchema)

module.exports = User