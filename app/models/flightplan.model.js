module.exports = (sequelize, Sequelize) => {
    const FlightPlan = sequelize.define("flightplan", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grad_semester: {
        type: Sequelize.STRING,
        allowNull: false,
   
      },
    });
  
    return FlightPlan;
  };
  