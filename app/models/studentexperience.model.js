module.exports = (sequelize, Sequelize) => {
    const StudentExperience = sequelize.define("studentexperience", {
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