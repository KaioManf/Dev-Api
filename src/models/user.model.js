const auditModel = require("./audit.model")

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    cpf: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    birthDate: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    cargoUser: {
      type: Sequelize.STRING,
    },
  })

  const Audit = auditModel(sequelize, Sequelize)

  user.beforeCreate(async (newUser) => {
    await Audit.create({
      table: "user",
      action: "create",
      data: newUser,
    })
  })

  user.beforeBulkUpdate(async (updatedUser) => {
    await Audit.create({
      table: "user",
      action: "update",
      data: updatedUser,
    })
  })

  user.beforeBulkDestroy(async (deletedUser) => {
    await Audit.create({
      table: "user",
      action: "delete",
      data: deletedUser,
    })
  })

  return user
}
