module.exports = (sequelize, Sequelize) => {
    const Experience = sequelize.define("experience", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      type: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      cliftonStrength: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      major: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Experience;
  };