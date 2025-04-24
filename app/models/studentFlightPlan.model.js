module.exports = (sequelize, Sequelize) => {
    const StudentFlightPlan = sequelize.define('StudentFlightPlan', {
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      flightPlanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'flightplans',
          key: 'id'
        }
      }
    }, {
      tableName: 'StudentFlightPlan',
      timestamps: false
    });
  
    return StudentFlightPlan;
  };