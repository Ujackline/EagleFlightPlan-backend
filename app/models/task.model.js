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

    reflection_required: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },

    scheduling_type: {
      type: Sequelize.STRING, // e.g. one-time, semesterly
      allowNull: true,
    },
    rationale: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    grad_semester: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    completion_type: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "confirmed", // Add this if you want to default it
    },    

    CliftonStrengths: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Example: task.model.js
    badge: {
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
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },


  });

  return Task;
};


