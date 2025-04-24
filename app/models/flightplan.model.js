module.exports = (sequelize, Sequelize) => {
  const FlightPlan = sequelize.define("flightplan", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    semester: {
      type: Sequelize.STRING,
      allowNull: false
    },
    grad_semester: {
      type: Sequelize.STRING,
      allowNull: false
    },
    progress: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    studentYear: {
      type: Sequelize.STRING
    },
    studentId: {  // Keep this field as it's the foreign key to Student
      type: Sequelize.INTEGER,
      allowNull: false
    }
    // Remove flightPlanId and taskId - they should NOT be here
  });
  
  return FlightPlan;
};