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

    semester: {
      type: Sequelize.STRING,
      allowNull: false,
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

    badge: {
      type: Sequelize.STRING,
      allowNull: true,
  },
    status: {
        type: Sequelize.ENUM("Incomplete", "Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Incomplete",
    },
    approvedBy: {
        type: Sequelize.STRING, // Can store an admin's name or ID
        allowNull: true,
    },
    completionDate: {
        type: Sequelize.DATE,
        allowNull: true,
    },


  });

  return Task;
};


