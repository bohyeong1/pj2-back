const mongoose = require('mongoose')
const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const userSchema = new Schema({
    firebase_uid:{
        type: String, 
        required: true, 
        unique: true
    },
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
    },
    nickname:{
        type:String,
        require:true
    },
    hostText:{
        type:String
    },
    host_state:{
        type:Boolean,
        default:false
    }
})


// =================================================
// DB 단계 검증 //
userSchema.path('email').validate(function(value){
    return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
}, 'email `{VALUE}` 는 잘못된 이메일 형식입니다.')
  
// =================================================
// user password //
userSchema.path('password').validate(function(value){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*\.]{7,15}$/.test(value)
}, 'password `{VALUE}` 는 잘못된 비밀번호 형식입니다.')

// =================================================
// user id //
userSchema.path('userId').validate(function(value){
    return/[a-zA-Z1-9]{7,12}/.test(value)
},'userId `{VALUE}`는 잘못된 아이디 형식입니다.')


const User = mongoose.model('User', userSchema)

module.exports = User