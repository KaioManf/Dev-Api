const jwt = require("jsonwebtoken")
const { v4: uuid } = require("uuid")
const { now } = require("../utils/datetime")
const configuration = require("../utils/configuration")

module.exports = class UserService {
  generateToken(user, userAgent) {
    const securityConfiguration = configuration().security
    const currentTime = now().unix()

    const payload = {
      agent: userAgent,
      renewAfter: currentTime + securityConfiguration.tokenExpiration,
      exp: currentTime + securityConfiguration.tokenMaxExpiration,
      iat: currentTime,
      nbf: currentTime,
      jti: uuid(),
      renewed: false,
      ...user,
    }

    const token = jwt.sign(payload, securityConfiguration.secret)

    return token
  }

  refreshToken(payload) {
    const securityConfiguration = configuration().security
    const currentTime = now().unix()

    const newPayload = {
      ...payload,
      renewAfter: currentTime + securityConfiguration.tokenExpiration,
      exp: currentTime + securityConfiguration.tokenMaxExpiration,
      iat: currentTime,
      nbf: currentTime,
      jti: uuid(),
      renewed: true,
    }

    const newToken = jwt.sign(newPayload, securityConfiguration.secret)

    return newToken
  }
}
