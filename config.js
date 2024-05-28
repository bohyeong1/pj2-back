const dotenv = require('dotenv')



dotenv.config() // process.env 객체에 환경변수 설정

module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  BUCKET_NAME: process.env.BUCKET_NAME,
  ACCESS_KEY: process.env.ACCESS_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
  ENDPOINT: process.env.ENDPOINT
  }