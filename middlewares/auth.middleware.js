const ApiError = require("../exceptions/api.error")
const tokenService = require("../services/token.service")

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) next(ApiError.UnauthorizedError())

        const accessToken = authHeader.split(" ")[1]

        if (!accessToken) next(ApiError.UnauthorizedError())

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (err) {
        next(ApiError.UnauthorizedError())
    }
}
