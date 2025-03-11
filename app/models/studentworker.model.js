module.exports = (sequelize, Sequelize) => {
    const StudentWorker = sequelize.define("studentworker", {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
   
      role: {
        type: Sequelize.ENUM("admin", "student", "student_worker"),
        allowNull: false,
        defaultValue: "student", // Default role for new users
      },

    });
  
    return StudentWorker;
  };
  