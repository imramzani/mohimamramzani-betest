const express = require('express')
const app = express()
const authModule = require("../modules/auth")
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')
const userModule = require('../modules/users')

module.exports = function (app){
let groupPath = '/auth'
const router = express.Router()
router.post("/register",authModule.registerHandler )
router.post("/login",authModule.loginHandler )

groupPath = '/users'

router.use(authentication)
router.get("/list", userModule.listHandler)
router.get("/acc/:accountNumber", userModule.getOneByAccountHandler)
router.get("/ic/:identityNumber", userModule.getOneByIDNumber)
router.post("/edit/:id", authorization ,userModule.updateHandler)
router.post("/delete/:id", authorization ,userModule.deleteHandler)
app.use(`${groupPath}`, router)


}