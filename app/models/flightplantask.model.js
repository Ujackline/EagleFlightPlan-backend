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
      type: Sequelize.ENUM('Incomplete', 'Pending', 'Approved', 'Rejected'),
      defaultValue: 'Incomplete'
    },

    CompletionDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

  });

  return FlightPlanTask;
};