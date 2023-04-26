const configuration = require("../utils/configuration")

const config = configuration()

module.exports = {
  development: {
    ...config.database,
  },
  test: {
    ...config.database,
  },
  production: {
    ...config.database,
  },
}
