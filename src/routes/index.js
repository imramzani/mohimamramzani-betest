const express = require('express')
const app = express()
const authModule = require("../modules/auth")
const medModule = require("../modules/medicines")

module.exports = function (app){
let groupPath = '/auth'
const routerAdmin = express.Router()
routerAdmin.post("/register",authModule.registerHandler )
routerAdmin.post("/login",authModule.loginHandler )

groupPath = '/medicine'
routerAdmin.get("/list", medModule.listDrugHandler)
routerAdmin.post("/add", medModule.addDrugsHandler)
routerAdmin.post("/edit/:id", medModule.updateHandler)
routerAdmin.post("/delete/:id", medModule.deleteHandler)
routerAdmin.get("/:id", medModule.getOneHandler)
routerAdmin.post("/:id", medModule.updateHandler)
app.use(`/admin${groupPath}`, routerAdmin)


}