const {v4: uuid} = require('uuid')

module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("drugs")
    const body = req.body
    console.log(body)
    const id = uuid()

    let objToInsert = {
        _id: id,
        name: body.name,
        price: body.price,
        count: body.count,
    }

    try {
        await col.insertOne(objToInsert)
        const newItem = await col.findOne({_id: objToInsert._id})
        return res.status(201).json({
            data: newItem,
            msg: "Success add medicine"
        })
    } catch (err) {
        return res.status(401).json({
            msg: "Failed add medicine"
        })
    }
    
}