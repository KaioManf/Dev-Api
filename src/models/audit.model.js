module.exports = (sequelize, Sequelize) => {
  const audit = sequelize.define(
    "audit",
    {
      table: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.JSON,
      },
    },
    { timestamps: false }
  )

  return audit
}
