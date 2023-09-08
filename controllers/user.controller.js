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

    async getUser(req, res, next) {
        try {
            const {userId} = req.params

            const user = await userService.getUser(userId)

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    }

    async editUser(req, res, next) {
        try {
            const {id, name, email, login} = req.body

            const user = await userService.editUser(id, login, name, email)

            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new UserController()
