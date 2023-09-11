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

    async uploadImage(req, res, next) {
        try {
            const image = req.files.image
            const {id} = req.body

            const ext = image.name.split(".").at(-1)

            const path = `/uploads/${id}/avatar_user_${id}.${ext}`

            await image.mv(`.${path}`)

            return path
        } catch (err) {
            next(err)
        }
    }

    async editUser(id, login, name, email, avatar) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id])

        if (!user.length) throw ApiError.NotFound()

        const loginCheck = await db.query("SELECT * FROM users WHERE login = $1 AND id != $2", [login, id])
        if (loginCheck.length) throw ApiError.Conflict("Login is already exists", {conflictField: "login"})

        if (email) {
            const emailCheck = await db.query("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id])
            if (emailCheck.length) throw ApiError.Conflict("Email is already exists", {conflictField: "email"})
        }

        const loginOverwrite = login ? login : user[0].login
        const nameOverwrite = name ? name : user[0].name
        const emailOverwrite = email ? email : user[0].email
        const avatarOverwrite = avatar ? avatar : user[0].avatar

        await db.query("UPDATE users SET name = $1, login = $2, email = $3, avatar = $4 WHERE id = $5", [nameOverwrite, loginOverwrite, emailOverwrite, avatarOverwrite, id])
        const editedUser = await db.query("SELECT * FROM users WHERE id = $1", [id])

        return {...new UserDto(editedUser[0])}
    }

    async deleteAvatar(id) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id])

        if (!user.length) throw ApiError.NotFound()

        await db.query("UPDATE users SET avatar = $1 WHERE id = $2", [null, id])
        const editedUser = await db.query("SELECT * FROM users WHERE id = $1", [id])

        return {...new UserDto(editedUser[0])}
    }
}

module.exports = new UserService()
