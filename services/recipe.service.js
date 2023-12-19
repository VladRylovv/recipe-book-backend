const dayjs = require("dayjs");
const md5 = require("md5")
const db = require("../db");
const RecipeDto = require("../dto/recipe.dto")
const ApiError = require("../exceptions/api.error")

class RecipeService {
    async uploadImageRecipe(req, res, next) {
        try {
            const image = req.files.image
            const {authorId} = req.body

            const ext = image.name.split(".").at(-1)

            const hashName = md5(image.name)
            const path = `/uploads/${authorId}/recipes/${hashName}.${ext}`

            await image.mv(`.${path}`)

            return path
        } catch (err) {
            next(err)
        }
    }

    async getRecipes() {
        const recipes = await db.query("SELECT * FROM recipes WHERE is_checked = $1", [true])
        const users = await db.query("SELECT * FROM users")

        return recipes.map(item => {
            const user = users.find(user => user.id === item.author_id)

            if (user) return {...new RecipeDto(item, user)}

            return {...new RecipeDto(item, null)}
        })
    }

    async getRecipesCheck() {
        const recipes = await db.query("SELECT * FROM recipes WHERE is_checked = $1", [false])
        const users = await db.query("SELECT * FROM users")

        return recipes.map(item => {
            const user = users.find(user => user.id === item.author_id)

            if (user) return {...new RecipeDto(item, user)}

            return {...new RecipeDto(item, null)}
        })
    }

    async checkRecipe(recipeId) {
        await db.query("UPDATE recipes SET is_checked = $1 WHERE id = $2", [true, recipeId])
        const recipe = await db.query("SELECT * FROM recipes WHERE id = $1", [recipeId])

        const authorId = recipe[0].author_id

        const user = await db.query("SELECT * FROM users WHERE id = $1", [authorId])

        return {...new RecipeDto(recipe[0], user[0])}
    }

    async getDetailRecipe(id) {
        const recipes = await db.query("SELECT * FROM recipes WHERE id = $1", [id])
        if (!recipes.length) throw ApiError.NotFound()

        const recipe = recipes[0]

        const user = await db.query("SELECT * FROM users WHERE id = $1", [recipe.author_id])

        return user ? {
            ...new RecipeDto(recipe, user[0])
        } : {
            ...new RecipeDto(recipe, null)
        }
    }

    async createRecipe(name, img, description, authorId, recipeText) {
        const date = dayjs(+new Date()).toDate()

        const user = await db.query("SELECT * FROM users WHERE id = $1", [authorId])

        const createdRecipe = await db.query(
            "INSERT INTO recipes (name, img, author_id, created_at, description, recipe_text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
            , [name, img, authorId, date, description, recipeText]
        )

        return user ? {
            ...new RecipeDto(createdRecipe[0], user[0])
        } : {
            ...new RecipeDto(createdRecipe[0], null)
        }
    }
}

module.exports = new RecipeService()
