const db = require("../db");
const UserDto = require("../dto/user.dto")

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
}

module.exports = new UserService()
