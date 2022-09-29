const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../../service/configs')

const bodyRules = joi.object({
    phoneNumber: joi.string()
    // .pattern(/^(\+62|62|0)8[1-9][0-9]{6,9}$/)
    .required()
    .error(
      new Error(
        'phone number invalid. Should use valid phone number (+628xxx)'
      )
    ),
    password: joi.string()
    // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
})

module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("systemUser")
    let body = await bodyValidation(req)
    console.log(body)

    let user = await col.findOne({phoneNumber: body.phoneNumber})
    if(!user) return res.status(403).json({msg: 'Incorrect phone number/ password'})

    try {
        const passCompare = await bcrypt.compare(body.password, user.password)
        if(!passCompare) return res.status(403).json({msg: 'Incorrect  password' })

        const claims = {
            id : user._id,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            role: user.role
        }

        const token = await jwt.sign(claims, configs.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: configs.jwtTimeOut
        })

        return res.status(200).json({
            token: token,
            msg: 'Login success',
            data: claims
        })
        
    } catch (err) {
        return res.status(500).json({
            msg: 'Internal Server Error'
        }) 
    }

}

async function bodyValidation(req){
    try {
        const res = await bodyRules.validateAsync(req.body, {stripUnknown: true})
        return res
    } catch (err) {
        console.log(err)
        return err
    }
}