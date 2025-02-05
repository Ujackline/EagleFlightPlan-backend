module.exports = (sequelize, Sequelize) => {
    const Award = sequelize.define("award", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },  

      redemption_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  
    return Award;
  };