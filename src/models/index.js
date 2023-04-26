const Sequelize = require("sequelize")
const User = require("./user.model")
const Product = require("./product.model")
const Audit = require("./audit.model")
const configuration = require("../utils/configuration")

const config = configuration()
const sequelize = new Sequelize(config.database)

const database = {
  Sequelize,
  sequelize,
  Audit: Audit(sequelize, Sequelize),
  User: User(sequelize, Sequelize),
  Product: Product(sequelize, Sequelize),
}

module.exports = database
