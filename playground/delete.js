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
      .deleteMany({text: 'Film new node'})
      .then(result => {
        console.log(result)
      })
    client.close()
  },
)
