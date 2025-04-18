module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskName: {
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
   
    semesterId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },


    CliftonStrengths: {

      type: Sequelize.STRING,
      allowNull: true,
    },
  
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set default to false
    },
    NumOfPoints: {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default 0 points
    },


    // points: {
    //   type: Sequelize.INTEGER,
    //   defaultValue: 0, // Default 0 points
    // },

    majors: {

      type: Sequelize.STRING,
      allowNull: true,
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