module.exports = (sequelize, Sequelize) => {
    const StudentEvent = sequelize.define("studentevent", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      pointsEarned: {
        type: Sequelize.INTEGER,
        allowNull: false,
              },
     reflectionText: {
        type: Sequelize.STRING,
        allowNull: false,
              },
    });
  
    return StudentEvent;
  };