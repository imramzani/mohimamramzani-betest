module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("drugs")
    const params = req.params
    const body = req.body

    const objToUpdate = {
        ...body,
        updatedAt: Date.now()
    }

    try {
        const item = await col.findOne({_id: params.id})
        if(!item) return res.status(401).json({
            msg: "Can not find medicine"
        })

        let updated = await col.updateOne({_id: params.id}, {$set: objToUpdate})
        updated = await col.findOne({_id: params.id})
        return res.status(200).json({
            data: updated,
            msg: "Success update data"
        })
    } catch (err) {
        return res.status(401).json({
            msg: "Can not find medicine"
        })
    }
}