const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../../service/configs')

const bodyRules = joi.object({
    identityNumber: joi.string().required(),
    password: joi.string().required(),
})

module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("users")
    let body = await bodyValidation(req)

    let user = await col.findOne({identityNumber: body.identityNumber})
    if(!user) return res.status(403).json({code: 403, success: false ,msg: 'Incorrect IC number/ password'})

    try {
        const passCompare = await bcrypt.compare(body.password, user.password)
        if(!passCompare) return res.status(403).json({msg: 'Incorrect  password' })

        const claims = {
            id : user._id,
            userName: user.userName,
            accountNumber: user.accountNumber,
            emailAddress: user.emailAddress,
            identityNumber: user.identityNumber,
        }

        const token = await jwt.sign(claims, configs.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: `${configs.jwtTimeOut}m`
        })

        return res.status(200).json({
            code: 200,
            success: true,
            token: token,
            msg: 'Login success',
            data: claims
        })
        
    } catch (err) {
        return res.status(500).json({
            code: 500,
            success: false,
            msg: 'Internal Server Error'
        }) 
    }

}

async function bodyValidation(req){
    try {
        const res = await bodyRules.validateAsync(req.body, {stripUnknown: true})
        return res
    } catch (err) {
        return err
    }
}