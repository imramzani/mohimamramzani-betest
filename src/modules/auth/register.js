const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joi = require('joi').extend(require('@joi/date'))
const {v4: uuidv4} = require('uuid')


const bodyRules = joi.object({
    phoneNumber: joi.string()
    // .pattern(/^(\+62|62|0)8[1-9][0-9]{6,9}$/)
    .required()
    .error(
      new Error(
        'phone number invalid. Should use valid phone number (+628xxx)'
      )
    ),
    gender: joi.string().required().allow('Male', 'Female'),
    dateOfBirth: joi.date().format('YYYY/MM/DD').required(),
    KTP: joi.string()
    // .pattern(/^\\d{6}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/)
    .required()
    .error(new Error('Must use Indonesian KTP number')),
    password: joi.string()
    // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
    role: joi.string().required().allow("Customer", "Admin")
})

module.exports = async function (req,res){
    let body = await bodyValidation(req)
    console.log(body)

    const col = req.mongoDB.db(req.mainDB).collection("systemUser")
    let usedPhoneNumber = await col.findOne({phoneNumber: body.phoneNumber})
    console.log(usedPhoneNumber)
    if(usedPhoneNumber) return res.status(401).json({msg: `Phone Number has been used`})

    let objToInsert = {
        _id : uuidv4(),
        phoneNumber: body.phoneNumber,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        KTP: body.KTP,
        password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(10)),
        role: body.role,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    try {
        let newUser = await col.insertOne(objToInsert)
        newUser = await col.findOne({phoneNumber: body.phoneNumber})
        return res.status(201).json({newUser, msg: 'Register success' }) 
    } catch (err) {
        console.log(err)
        return res.status(404).json({msg: `Can't register user`})
    }

}
async function bodyValidation (req){
    try {
        const res = await bodyRules.validateAsync(req.body, {stripUnknown: true})
        return res 
    } catch (error) {
        return error
    }
}