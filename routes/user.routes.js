const Router = require("express")
const router = new Router()
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const permissionMiddleware = require("../middlewares/permission.middleware")

router.get("/getUsers", authMiddleware, userController.getUsers)
router.get("/getUser/:userId", authMiddleware, userController.getUser)
router.put("/editUser", authMiddleware, permissionMiddleware, userController.editUser)
router.delete("/deleteAvatar", authMiddleware, permissionMiddleware,  userController.deleteAvatar)

module.exports = router
