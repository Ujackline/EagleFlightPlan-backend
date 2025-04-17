module.exports = (sequelize, Sequelize) => {
  const FlightPlan = sequelize.define("flightplan", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    semesterId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    gradSemesterId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });



  return FlightPlan;
};