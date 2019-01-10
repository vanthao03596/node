const {MongoClient, ObjectID} = require('mongodb')

const url = 'mongodb://localhost:27017'
const dbName = 'test'

MongoClient.connect(
  url,
  {useNewUrlParser: true},
  (err, client) => {
    if (err) {
      return console.log('can not connect')
    }
    const db = client.db(dbName)
    db.collection('Todos')
      .find({completed: false})
      .toArray()
      .then(
        docs => {
          console.log(JSON.stringify(docs, undefined, 2))
        },
        err => {
          console.log('Unable to fetch', err)
        },
      )
    // client.close()
  },
)
