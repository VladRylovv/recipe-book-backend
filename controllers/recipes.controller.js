const recipeService = require("../services/recipe.service")

class RecipesController {
    async getRecipes(req, res, next) {
        try {
            const recipes = await recipeService.getRecipes()

            res.status(200).json(recipes)
        } catch (err) {
            next(err)
        }
    }

    async getDetailRecipe(req, res, next) {
        try {
            const {recipeId} = req.params

            const recipe = await recipeService.getDetailRecipe(recipeId)

            res.status(200).json(recipe)
        } catch (err) {
            next(err)
        }
    }

    async createRecipe(req, res, next) {
        try {
            const {name, img, description, authorId} = req.body

            const recipe = await recipeService.createRecipe(name, img, description, authorId)

            res.status(200).json(recipe)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new RecipesController()
