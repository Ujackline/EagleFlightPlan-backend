module.exports = (sequelize, Sequelize) => {
    const StudentBadge = sequelize.define("studentbadge", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DateAwarded: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  
    return StudentBadge;
  };