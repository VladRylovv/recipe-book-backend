const jwt = require("jsonwebtoken")
const db = require("../db")

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})

        return {accessToken, refreshToken}
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        } catch (e) {
            return null
        }
    }

    async saveToken(id, refreshToken) {
        const token = await db.query("SELECT * FROM tokens WHERE user_id = $1", [id])

        if (token.length) {
            await db.query("UPDATE tokens SET token = $1 WHERE user_id = $2", [refreshToken, id])
            return
        }

        await db.query("INSERT INTO tokens (token, user_id) VALUES ($1, $2)", [refreshToken, id])
    }

    async deleteToken(refreshToken) {
        await db.query("DELETE FROM tokens WHERE token = $1", [refreshToken])
    }
}

module.exports = new TokenService()
