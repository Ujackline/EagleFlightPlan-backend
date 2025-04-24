// models/flightplanevent.model.js
module.exports = (sequelize, Sequelize) => {
    const FlightPlanEvent = sequelize.define("flightplanevent", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'registered' // Options: 'registered', 'attended', 'pending', 'approved', etc.
      },
      pointsEarned: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      
      attendanceDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  
    return FlightPlanEvent;
  };