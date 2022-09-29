const express = require('express')
const app = express()
const authModule = require("../modules/auth")

module.exports = function (app){
let groupPath = '/auth'
const routerAdmin = express.Router()
routerAdmin.post("/register",authModule.registerHandler )
routerAdmin.post("/login",authModule.loginHandler )
app.use(`/admin${groupPath}`, routerAdmin)


}