module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("student", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      studentID: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      major: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      grad_semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      cliftonstrengths: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      TotalPoints: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      

    });
  
    return Student;
  };
  