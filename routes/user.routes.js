const Router = require("express")
const router = new Router()
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/getUsers", authMiddleware, userController.getUsers)

module.exports = router
