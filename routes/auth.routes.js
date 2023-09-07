const Router = require("express")
const router = new Router()
const authController = require("../controllers/auth.controller")

router.post("/createUser", authController.createUser)
router.post("/loginUser", authController.loginUser)
router.post("/logoutUser", authController.logoutUser)
router.get("/refreshToken", authController.refreshToken)

module.exports = router
