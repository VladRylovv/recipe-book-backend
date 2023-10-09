require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const fileUpload = require('express-fileupload');
const path = require('node:path');
const userRouter = require("./routes/user.routes")
const authRouter = require("./routes/auth.routes")
const recipesRouter = require("./routes/recipes.routes")
const errorMiddleware = require("./middlewares/error.middleaware");

const PORT = process.env.PORT || 3002

const app = express()

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, authorization');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, GET, DELETE');
    res.header('Access-Control-Allow-Credentials', "true");
    next();
});
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
app.use(fileUpload({
    createParentPath: true
}));
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/recipe", recipesRouter)
app.use(errorMiddleware)

const server = app.listen(PORT, err => {
    if (err) return console.log(`Error: ${err}`)

    console.log(`Server started on ${server.address().port} port`)
})
