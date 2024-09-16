const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  BUCKET_NAME: process.env.BUCKET_NAME,
  ACCESS_KEY: process.env.ACCESS_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
  ENDPOINT: process.env.ENDPOINT,
  FIREBASE_URL : process.env.FIREBASE_URL,
  MAPPING_EMAIL : process.env.MAPPING_EMAIL,
  MAILGUN_KEY : process.env.MAILGUN_KEY,
  MAILGUN_DOMAIN : process.env.MAILGUN_DOMAIN,
  KAKAO_REST_API_KEY : process.env.KAKAO_REST_API_KEY
}