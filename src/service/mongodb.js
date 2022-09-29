const { MongoClient } = require('mongodb')
const configs = require('./configs')

let cacheDb;

const createClient = function () {
  return new Promise((resolve, reject) => {
    if (cacheDb) {
      resolve(cacheDb)
      return
    }

    MongoClient.connect(configs.atlasDB.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then((db) => {
        cacheDb = db
        resolve(cacheDb)
      })
      .catch((err) => {
        cacheDb = null
        console.log(err)

        if (cacheDb) {
          cacheDb.close()
          cacheDb = null
        }
        reject(String(err))
      })
  })
}

module.exports = createClient
