const auditModel = require("./audit.model")

module.exports = (sequelize, Sequelize) => {
  const product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.FLOAT,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  })

  const Audit = auditModel(sequelize, Sequelize)

  product.beforeCreate(async (newProduct) => {
    await Audit.create({
      table: "product",
      action: "create",
      data: newProduct,
    })
  })

  product.beforeBulkUpdate(async (updatedProduct) => {
    await Audit.create({
      table: "product",
      action: "update",
      data: updatedProduct,
    })
  })

  product.beforeBulkDestroy(async (deletedProduct) => {
    await Audit.create({
      table: "product",
      action: "delete",
      data: deletedProduct,
    })
  })

  return product
}
