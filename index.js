if (process.env.NODE_ENV === "dev") {
    require("dotenv").config();
  }
const express = require('express')
const app = express()
const routes = require('./src/routes')
const port = process.env.PORT
const middlewareDb = require('./src/middlewares/databse')


app.use(express.json({ limit: '20MB' }))
app.use(express.urlencoded({extended: true}))

app.use(middlewareDb)

routes(app)

app.get('/', (req, res) => {
    res.send('OK get in')
  })

app.listen(port, ()=> {
    console.log(`Listening to PORT ${port}`)
})


module.exports = app
