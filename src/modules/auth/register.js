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
    let body = await bodyValidation(req)

    const col = req.mongoDB.db(req.mainDB).collection("users")
    let usedIdNumber = await col.findOne({ identityNumber: body.identityNumber })
    if (usedIdNumber) return res.status(401).json({ code: 401, success: false, msg: `ID Number already been used` })

    let objToInsert = {
        _id: uuidv4(),
        userName: body.userName,
        accountNumber: iban.fake(),
        emailAddress: body.emailAddress,
        password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(10)),
        identityNumber: body.identityNumber,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    try {
        let newUser = await col.insertOne(objToInsert)
        newUser = await col.findOne({ identityNumber: body.identityNumber }, { projection: { _id: 1, userName: 1, accountNumber: 1, emailAddress: 1, identityNumber: 1, createdAt: 1 } })
        await redis.del('AllUser')
        return res.status(201).json({ code: 201, success: true, data: newUser, msg: 'Register success' })
    } catch (err) {
        return res.status(401).json({ code: 401, success: false, msg: `Can't register user` })
    }

}
async function bodyValidation(req) {
    try {
        const res = await bodyRules.validateAsync(req.body, { stripUnknown: true })
        return res
    } catch (error) {
        return error
    }
}