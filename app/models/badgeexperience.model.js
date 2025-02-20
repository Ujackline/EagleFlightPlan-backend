module.exports = (sequelize, Sequelize) => {
    const BadgeExperience = sequelize.define("badgeexperience", {
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
  
    return BadgeExperience;
  };