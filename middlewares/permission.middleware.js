const ApiError = require("../exceptions/api.error")

module.exports = (req, res, next) => {
    try {
        const {id: requestId} = req.body
        const {id: userId} = req.user

        if (+requestId !== +userId) next(ApiError.Forbidden())

        next()
    } catch (err) {
        next(err)
    }
}
