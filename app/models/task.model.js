module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    category: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    task_type: {
      type: Sequelize.STRING
    },
    // Remove the semester column
    semesterId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },
    cliftonstrengths: {
      type: Sequelize.STRING
    },
    points: {
      type: Sequelize.STRING,
      allowNull: false
    },
    major: {
      type: Sequelize.STRING
    },
    badge: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('Incomplete', 'Pending', 'Approved', 'Rejected'),
      defaultValue: 'Incomplete'
    },
    approvedBy: {
      type: Sequelize.STRING
    },
    completionDate: {
      type: Sequelize.DATE
    }
  }, {
    // Add any additional model options if needed
  });

  // Add associations
  Task.associate = (models) => {
    Task.belongsTo(models.Semester, {
      foreignKey: 'semesterId',
      as: 'semesterInfo'
    });
  };

  return Task;
};