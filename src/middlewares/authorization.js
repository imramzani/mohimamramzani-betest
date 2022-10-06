const jwt = require('jsonwebtoken')
const configs = require('../service/configs')

module.exports = async function (req, res, next) {
    const {id: userId} = req.params
    const authHeader = req.headers && req.headers.authorization ? req.headers.authorization : null
    if (!authHeader) return res.status(403).json({
        msg: 'Invalid token'
    })

    const matchToken = authHeader.match(/^Bearer (.*)$/)

    if (!matchToken || matchToken.length < 2) {

        return res.status(403).json({
            msg: 'Invalid token'
        })
    }

    try {
        const token = matchToken[1].trim()
        const decoded = jwt.verify(token, configs.jwtSecret)
        const { id: tokenId } = decoded
        req.auth = { ...decoded }
        if (tokenId !== userId) return res.status(403).json({
            msg: "Not Authorized"
        })
        

    } catch (err) {
        return res.status(403).json({
            msg: "Token not found"
        })
    }
    
    return next()

}