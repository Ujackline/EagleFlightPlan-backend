module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      }
    });
  
    return Report;
  };
  