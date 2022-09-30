module.exports = async function (req, res){
    const col = req.mongoDB.db(req.mainDB).collection("drugs")
    let option = {

    }
    try {

        let result = await col.find({}).toArray()
        console.log(result)
        return res.status(200).json({
            data: result
        })
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            msg: 'Cannot find medicine'
        })
    }
}