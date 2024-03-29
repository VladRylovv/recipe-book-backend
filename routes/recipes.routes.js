const Router = require("express")
const router = new Router()
const recipesController = require("../controllers/recipes.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/getRecipes", recipesController.getRecipes)
router.get("/getRecipesCheck", recipesController.getRecipesCheck)
router.post("/checkRecipe/:recipeId", recipesController.checkRecipe)
router.delete("/removeRecipe/:recipeId", recipesController.removeRecipe)
router.get("/getDetailRecipe/:recipeId", recipesController.getDetailRecipe)
router.post("/createRecipe", authMiddleware, recipesController.createRecipe)

module.exports = router
