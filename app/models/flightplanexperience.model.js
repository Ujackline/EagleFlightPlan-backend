module.exports = (sequelize, Sequelize) => {
    const FlightPlanExperience = sequelize.define("flightplanexperience", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    });
  
    return FlightPlanExperience;
  };