module.exports = (sequelize, Sequelize) => {
    const BadgeTask = sequelize.define("badgetask", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      criteria: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return BadgeTask;
  };