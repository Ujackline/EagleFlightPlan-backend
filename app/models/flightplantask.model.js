module.exports = (sequelize, Sequelize) => {
    const FlightPlanTask = sequelize.define("flightplantask", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
     
      semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      CompletionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      points: {
        type: Sequelize.STRING,
        allowNull: false,
      },

    });
  
    return FlightPlanTask;
  };