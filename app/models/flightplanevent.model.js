module.exports = (sequelize, Sequelize) => {
    const FlightPlanEvent = sequelize.define("flightplanevent", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    });
  
    return FlightPlanEvent;
  };