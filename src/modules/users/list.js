const redis = require("../../service/redis")

module.exports = async function (req, res) {
    const col = req.mongoDB.db(req.mainDB).collection("users")
    let option = {
        $project: {
            _id: 1,
            userName: 1,
            emailAddress: 1,
            accountNumber: 1,
            identityNumber: 1,
        }
    }
    try {
        let result = await redis.get("AllUser")
        if (!result) {
            result = await col.aggregate([option]).toArray()
            await redis.set("AllUser", JSON.stringify(result))
        } else {
            console.log('from redis')
            result = JSON.parse(result)
        }
        return res.status(200).json({
            code: 200,
            success: true,
            data: result,
            count: result.length,
            msg: 'Success fetch data'
        })
    } catch (err) {
        return res.status(500).json({
            code: 500,
            success: false,
            msg: 'Internal server error'
        })
    }
}