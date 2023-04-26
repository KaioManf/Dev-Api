const express = require("express")
const helmet = require("helmet")
const ProductController = require("./controllers/product.controller")
const UserController = require("./controllers/user.controller")
const authMiddleware = require("./middlewares/auth.middleware")
const adminMiddleware = require("./middlewares/admin.middleware")

const userController = new UserController()
const productController = new ProductController()

const app = express()
app.use(express.json())
app.use(
  helmet.frameguard({
    action: "sameorigin",
  })
)
app.use(helmet.hidePoweredBy())

const port = 3000

app.get("/", (request, response) => {
  response.send("Hello World")
})

app.post("/user/login", userController.login)
app.get("/user", adminMiddleware, authMiddleware, userController.getAll)
app.get("/user/:id", adminMiddleware, authMiddleware, userController.findOne)
app.post("/user", userController.create)
app.put("/user/:id", adminMiddleware, authMiddleware, userController.update)
app.patch("/user/:id", adminMiddleware, authMiddleware, userController.patch)
app.delete("/user/:id", adminMiddleware, authMiddleware, userController.delete)

app.get("/product", adminMiddleware, authMiddleware, productController.getAll)
app.get("/product/:id", adminMiddleware, authMiddleware, productController.findOne)
app.post("/product", adminMiddleware, authMiddleware, productController.create)
app.put("/product/:id", adminMiddleware, authMiddleware, productController.update)
app.patch("/product/:id", adminMiddleware, authMiddleware, productController.patch)
app.delete("/product/:id", adminMiddleware, authMiddleware, productController.delete)

app.listen(port, () => {
  console.log(`Servidor está rodando em
     http://localhost:${port}`)
})
