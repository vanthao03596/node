const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  {
    auth: {
      user: process.env.MONGO_DB_USER || '',
      password: process.env.MONGO_DB_PASSWORD || '',
    },
    useNewUrlParser: true,
  },
)

module.exports = {
  mongoose,
}
