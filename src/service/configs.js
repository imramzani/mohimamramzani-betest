const path = require('path')
if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({
      path: path.join(__dirname, '../../', '.env.test'),
    })
  } else {
    require('dotenv').config()
  }

function getConfig(){
    const configs = {
        atlasDB: {
            url: process.env.MONGODB_URI,
            db: process.env.MONGODB_DB
        },
        port: process.env.PORT,
        jwtSecret: process.env.JWT_SECRET,
        jwtTimeOut: process.env.JWT_TIMEOUT,
        
    }
    return configs
}

module.exports = getConfig()