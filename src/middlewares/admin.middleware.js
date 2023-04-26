const jwt = require("jsonwebtoken")
const configuration = require("../utils/configuration")

module.exports = function adminMiddleware(request, response, next) {
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

    if (payload.cargoUser === "adm") {
      next()
    } else {
      response.status(403)
      response.send({
        error: "Você não tem permissão para fazer esta ação!",
      })
    }

  } catch (error) {
    response.status(401)
    response.send({
      error: "Token de autorização inválido: " + error,
    })
  }
}