module.exports = (sequelize, Sequelize) => {
    const StudentExperience = sequelize.define("studentexperience", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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

      CompletionDate: {
        type: Sequelize.DATE,
        allowNull: true,
              },
    
      pointsEarned: {
        type: Sequelize.INTEGER,
        allowNull: false,
              },
     reflectionText: {
        type: Sequelize.STRING,
        allowNull: true,
              },
              
    });
  
    return StudentExperience;
  };