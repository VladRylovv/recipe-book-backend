const authService = require("../services/auth.service")

class AuthController {
    async createUser(req, res, next) {
        try {
            const {login, password} = req.body

            const userData = await authService.registration(login, password)
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async loginUser(req, res, next) {
        try {
            const {login, password} = req.body

            const userData = await authService.login(login, password)

            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async logoutUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            await authService.logout(refreshToken)
            res.clearCookie("refreshToken")

            res.status(200).json({message: "Logout success"})
        } catch (err) {
            next(err)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            const userData = await authService.refresh(refreshToken)
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})

            res.status(200).json(userData)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()
