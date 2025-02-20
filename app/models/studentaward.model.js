module.exports = (sequelize, Sequelize) => {
    const StudentAward = sequelize.define("studentaward", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      RedemptionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  
    return StudentAward;
  };