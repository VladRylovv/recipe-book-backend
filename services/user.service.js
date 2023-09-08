const db = require("../db");
const UserDto = require("../dto/user.dto")
const ApiError = require("../exceptions/api.error")

class UserService {
    async findUser(login) {
        const findUser = await db.query("SELECT * FROM users WHERE login = $1", [login])

        if (!findUser.length) return false

        return findUser[0]
    }

    async getUsers() {
        const users = await db.query("SELECT * FROM users")

        return users.map(item => {
            const userFormat = new UserDto(item)

            return {...userFormat}
        })
    }

    async getUser(id) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id])

        if (user.length === 0) throw ApiError.NotFound()

        return {...new UserDto(user[0])}
    }

    async editUser(id, login, name, email) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id])

        if (!user.length) throw ApiError.NotFound()

        const loginCheck = await db.query("SELECT * FROM users WHERE login = $1 AND id != $2", [login, id])
        if (loginCheck.length) throw ApiError.BadRequest("Login is already exists")

        if (email) {
            const emailCheck = await db.query("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id])
            if (emailCheck.length) throw ApiError.BadRequest("Email is already exists")
        }

        await db.query("UPDATE users SET name = $1, login = $2, email = $3 WHERE id = $4", [name, login, email, id])
        const editedUser = await db.query("SELECT * FROM users WHERE id = $1", [id])

        return {...new UserDto(editedUser[0])}
    }
}

module.exports = new UserService()
