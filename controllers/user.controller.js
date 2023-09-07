const userService = require("../services/user.service")

class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers()

            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new UserController()
