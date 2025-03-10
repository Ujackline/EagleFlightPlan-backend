module.exports = (sequelize, Sequelize) => {
    const FlightPlanExperience = sequelize.define("flightplanexperience", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      CompletionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  
    return FlightPlanExperience;
  };