module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
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


    cliftonstrengths: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    points: {
      type: Sequelize.STRING,
      allowNull: false,
    },


    major: {
      type: Sequelize.STRING,
      allowNull: true,
    },


  });

  return Task;
};

