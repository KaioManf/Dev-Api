const jwt = require("jsonwebtoken")
const configuration = require("../utils/configuration")
const { now } = require("../utils/datetime")
const UserService = require("../services/user.service")

const userService = new UserService()

module.exports = function authMiddleware(request, response, next) {
  const authorization = request.headers.authorization
  const token = authorization?.split(" ")[1]

  if (!token) {
    response.status(401)
    response.send({
      error:
        "Você precisa estar autenticado para ter permissão para fazer esta ação!",
    })
    return
  }

  try {
    const payload = jwt.verify(token, configuration().security.secret)

    const currentTime = now().unix()

    if (currentTime > payload.exp) {
      response.status(401)
      response.send({
        error: "O token de autorização expirou!",
      })
      return
    }

    if (currentTime > payload.renewAfter) {
      const newToken = userService.refreshToken(payload)
      response.header("Authorization", `Bearer ${newToken}`)
    }
    next()
  } catch (error) {
    response.status(401)
    response.send({
      error: "Token de autorização inválido: " + error,
    })
  }
}