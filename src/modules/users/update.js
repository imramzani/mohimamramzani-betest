const redis = require('../../service/redis')
const joi = require('joi')


const bodyRules = joi.object({
    userName: joi.string(),
    emailAddress: joi.string(),
    identityNumber: joi.string(),
    accountNumber: joi.string()
})
module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("users")
    const params = req.params
    let body = await bodyValidation(req,res)

    const objToUpdate = {
        ...body,
        updatedAt: Date.now()
    }

    try {
        const item = await col.findOne({_id: params.id})
        if(!item) return res.status(401).json({
            msg: "Can not find user"
        })

        let updated = await col.updateOne({_id: params.id}, {$set: objToUpdate})
        updated = await col.findOne({_id: params.id}, { projection: { _id: 1, userName: 1, accountNumber: 1, emailAddress: 1, identityNumber: 1, createdAt: 1 } })
        await redis.del('AllUser')
        return res.status(200).json({
            data: updated,
            msg: "Success update data"
        })
    } catch (err) {
        return res.status(500).json({
            code: 500,
            success: false,
            msg: "Internal server error"
        })
    }
}


async function bodyValidation(req, res) {
    try {
        const result = await bodyRules.validateAsync(req.body, { stripUnknown: true })
        return result
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            code: 401,
            success: false,
            msg: error.details[0].message
        })
    }
}