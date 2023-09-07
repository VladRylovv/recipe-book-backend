const dayjs = require("dayjs");
const db = require("../db");
const RecipeDto = require("../dto/recipe.dto")
const ApiError = require("../exceptions/api.error")

class RecipeService {
    async getRecipes() {
        const recipes = await db.query("SELECT * FROM recipes")
        const users = await db.query("SELECT * FROM users")

        const recipesFormat = recipes.map(item => {
            const user = users.find(user => user.id === item.author_id)

            if (user) return {...new RecipeDto(item, user)}

            return {...new RecipeDto(item, null)}
        })

        return recipesFormat
    }

    async getDetailRecipe(id) {
        const recipes = await db.query("SELECT * FROM recipes WHERE id = $1", [id])
        if (!recipes.length) throw ApiError.NotFound()

        const recipe = recipes[0]

        const user = await db.query("SELECT * FROM users WHERE id = $1", [recipe.author_id])

        const recipeFormat = user ? {
            ...new RecipeDto(recipe, user[0])
        } : {
            ...new RecipeDto(recipe, null)
        }

        return recipeFormat
    }

    async createRecipe(name, img, description, authorId) {
        const date = dayjs(+new Date()).toDate()

        const user = await db.query("SELECT * FROM users WHERE id = $1", [authorId])

        const createdRecipe = await db.query(
            "INSERT INTO recipes (name, img, author_id, created_at, description) VALUES ($1, $2, $3, $4, $5) RETURNING *"
            , [name, img, authorId, date, description]
        )

        const recipeFormat = user ? {
            ...new RecipeDto(createdRecipe[0], user[0])
        } : {
            ...new RecipeDto(createdRecipe[0], null)
        }

        return recipeFormat
    }
}

module.exports = new RecipeService()
