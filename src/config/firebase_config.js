const admin = require('firebase-admin')

const service_account = require('../../firebase.json')
const config = require('./env_config')

admin.initializeApp({
  credential: admin.credential.cert(service_account),
  databaseURL: config.FIREBASE_URL
})

module.exports = admin

