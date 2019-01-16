const mongoose = require('mongoose')

mongoose.Promise = global.Promise
let opts = {
  useNewUrlParser: true,
}

let uri = process.env.DB_LOCALHOST

if (process.env.APP_ENV === 'production') {
  opts['auth'] = {
    user: process.env.MONGO_DB_USER,
    password: process.env.MONGO_DB_PASSWORD,
  }
  uri = process.env.MONGO_DB_URI
}

console.log(uri)
mongoose.connect(
  uri,
  opts,
)

module.exports = {
  mongoose,
}
