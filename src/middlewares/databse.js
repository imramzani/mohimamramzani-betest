const mongoConnect = require('../service/mongodb')
const configs = require('../service/configs')

module.exports = async function (req, res, next) {
  if (req.middlewareDB) {
    return next()
  }
  req.middlewareDB = true

  req.mainDB = configs.atlasDB.db
//   console.log(req.mainDB, "maindbbbbbb")

  try {
    req.mongoDB = await mongoConnect()
    console.log('db connected')
    if (!req.mongoDB) {
      return res.status(401).json({message: 'db connection error'})
    }
  } catch (err) {
    return res.status(500).json({message: String(err)})
  }

  return next()
}