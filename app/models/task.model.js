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
    status: {
      type: Sequelize.ENUM('Incomplete', 'Pending', 'Approved', 'Rejected'),
      defaultValue: 'Incomplete'
    },
    approvedBy: {
      type: Sequelize.STRING
    },
    applicableYear: {
      type: Sequelize.ENUM(
        'Freshman', 
        'Sophomore', 
        'Junior', 
        'Senior', 
        'Junior Fall', 
        'Junior Spring', 
        'Senior Fall', 
        'Senior Spring',
        'Sophomore Spring',
        'Fall 2025',
        'Spring 2025',
        'Summer 2025'
      ),
      allowNull: true
    },
   
  }, {
   
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