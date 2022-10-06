module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("users")
    const params = req.params

    try {
        const item = await col.findOne({accountNumber: params.accountNumber}, { projection: { _id: 1, userName: 1, accountNumber: 1, emailAddress: 1, identityNumber: 1, createdAt: 1 } })
        if (!item) return res.status(401).json({
            code: 401,
            success: false,
            msg: "Can not find user"
        })
        return res.status(200).json({
            code: 200,
            success: true,
            data: item,
            msg: "Success fetch data"
        })
    } catch (err) {
        return res.status(500).json({
            code: 500,
            success: false,
            msg: "Internal server error"
        })
    }
}