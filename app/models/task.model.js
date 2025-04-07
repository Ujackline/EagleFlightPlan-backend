module.exports = (sequelize, Sequelize) => {

  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    taskName: {
      type: Sequelize.STRING,
      allowNull: false,
    },


    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
       
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },


    task_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },  

    grad_semester: {
      type: Sequelize.STRING,
      allowNull: true,
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


  });

  return Task;
};


