module.exports = (sequelize, Sequelize) => {
    const StudentSemester = sequelize.define("StudentSemester", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      is_current: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      enrollment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      credits_earned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'completed', 'planned'],
        defaultValue: 'active'
      }
    });
  
    return StudentSemester;
  };