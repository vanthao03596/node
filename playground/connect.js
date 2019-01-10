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
    db.collection('Todos').insertOne(
      {
        text: 'Something to do',
        completed: false,
      },
      (err, result) => {
        if (err) {
          return console.log('Cant insert')
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
      },
    )
    client.close()
  },
)
