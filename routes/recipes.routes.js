const Router = require("express")
const router = new Router()
const recipesController = require("../controllers/recipes.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/getRecipes", authMiddleware, recipesController.getRecipes)
router.get("/getDetailRecipe/:recipeId", recipesController.getDetailRecipe)
router.post("/createRecipe", authMiddleware, recipesController.createRecipe)

module.exports = router
