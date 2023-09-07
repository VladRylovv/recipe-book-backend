const bcrypt = require("bcrypt");
const dayjs = require('dayjs')
const db = require("../db");
const UserDto = require("../dto/user.dto")
const tokenService = require("../services/token.service")
const userService = require("./user.service");
const ApiError = require("../exceptions/api.error")

class AuthService {
    async registration(login, password) {
        const user = await userService.findUser(login)

        if (user) throw new ApiError(409, "Login already exists")

        const hashPassword = await bcrypt.hash(password, 10)
        const date = dayjs(+new Date()).toDate()

        const newUser = await db.query(`INSERT INTO users (login, password, created_at) VALUES ($1, $2, $3) RETURNING *`, [login, hashPassword, date])

        const userFormat = new UserDto(newUser[0])
        const tokens = tokenService.generateTokens({...userFormat})
        await tokenService.saveToken(userFormat.id, tokens.refreshToken)

        return {...tokens, user: {...userFormat}}
    }

    async login(login, password) {
        const user = await userService.findUser(login)

        if (!user) throw ApiError.NotFound("User not found")

        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) throw ApiError.BadRequest("Incorrect password")

        const userFormat = new UserDto(user)
        const tokens = tokenService.generateTokens({...userFormat})
        await tokenService.saveToken(userFormat.id, tokens.refreshToken)

        return {...tokens, user: {...userFormat}}
    }

    async logout(refreshToken) {
        await tokenService.deleteToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenDb = await db.query("SELECT * FROM tokens WHERE token = $1", [refreshToken])

        if (!userData || !tokenDb.length) throw ApiError.UnauthorizedError()

        const updatedUser = await db.query("SELECT * FROM users WHERE id = $1", [userData.id])

        const userFormat = new UserDto(updatedUser[0])
        const tokens = tokenService.generateTokens({...userFormat})
        await tokenService.saveToken(userFormat.id, tokens.refreshToken)

        return {...tokens, user: {...userFormat}}
    }
}

module.exports = new AuthService()
