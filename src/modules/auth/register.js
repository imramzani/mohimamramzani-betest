const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const { iban } = require('@phuocng/fake-numbers')
const redis = require('../../service/redis')

const bodyRules = joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
    emailAddress: joi.string().required(),
    identityNumber: joi.string().required()
})

module.exports = async function (req, res) {

    try {
        let body = await bodyValidation(req, res)
        let password
        if (body.password) {
            password = bcrypt.hashSync(body.password || "0000", bcrypt.genSaltSync(10))
        }

        const col = req.mongoDB.db(req.mainDB).collection("users")
        let usedIdNumber = await col.findOne({ identityNumber: body.identityNumber })
        if (usedIdNumber) return res.status(401).json({ code: 401, success: false, msg: `ID Number already been used` })

        let objToInsert = {
            _id: uuidv4(),
            userName: body.userName,
            accountNumber: iban.fake(),
            emailAddress: body.emailAddress,
            password: password,
            identityNumber: body.identityNumber,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        let newUser = await col.insertOne(objToInsert)
        newUser = await col.findOne({ identityNumber: body.identityNumber }, { projection: { _id: 1, userName: 1, accountNumber: 1, emailAddress: 1, identityNumber: 1, createdAt: 1 } })
        await redis.del('AllUser')
        return res.status(201).json({ code: 201, success: true, data: newUser, msg: 'Register success' })
    } catch (err) {
        console.log(err)
        if (err.code) {
            return res.status(err.code).json({
                code: err.code,
                success: err.success,
                msg: err.msg
            })
        } else return res.status(500).json({
            code: 500,
            success: false,
            msg: "Internal server error"
        })
    }

}
async function bodyValidation(req, res) {
    try {
        const res = await bodyRules.validateAsync(req.body, { stripUnknown: true })
        return res
    } catch (error) {
        throw {
            code: 401,
            success: false,
            msg: error.details[0].message
        }
    }
}