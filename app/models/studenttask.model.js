module.exports = (sequelize, Sequelize) => {
    const StudentTask = sequelize.define("studenttask", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      CompletionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // models/studentTask.model.js
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      
              
    });
  
    return StudentTask;
  };