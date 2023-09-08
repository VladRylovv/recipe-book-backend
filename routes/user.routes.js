const Router = require("express")
const router = new Router()
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/getUsers", authMiddleware, userController.getUsers)
router.get("/getUser/:userId", authMiddleware, userController.getUser)
router.put("/editUser", authMiddleware, userController.editUser)

module.exports = router
