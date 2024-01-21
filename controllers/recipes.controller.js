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

    async getRecipesCheck(req, res, next) {
        try {
            const recipes = await recipeService.getRecipesCheck()

            res.status(200).json(recipes)
        } catch (err) {
            next(err)
        }
    }

    async checkRecipe(req, res, next) {
        try {
            const {recipeId} = req.params

            const recipe = await recipeService.checkRecipe(recipeId)

            res.status(200).json({
                recipeId,
                recipe,
                message: "Success check"
            })
        } catch (err) {
            next(err)
        }
    }

    async removeRecipe(req, res, next) {
        try {
            const {recipeId} = req.params

            await recipeService.removeRecipe(recipeId)

            res.status(200).json({
                message: "Success remove",
                recipeId: +recipeId
            })
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
            const {name, description, authorId, recipeText} = req.body

            const image = req.files?.image ? await recipeService.uploadImageRecipe(req, res, next) : null

            const recipe = await recipeService.createRecipe(name, image, description, authorId, recipeText)

            res.status(200).json(recipe)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new RecipesController()
