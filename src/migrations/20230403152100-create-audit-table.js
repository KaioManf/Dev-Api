module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      table: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable("audits")
  },
}
