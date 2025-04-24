module.exports = (sequelize, Sequelize) => {
  const StudentEvent = sequelize.define("studentevent", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'registered'
    },
    pointsEarned: {
      type: Sequelize.INTEGER,
      allowNull: true,  // Change to allow null
      defaultValue: 0
    },
    reflectionText: {
      type: Sequelize.STRING,
      allowNull: true,  // Change to allow null
      defaultValue: ''
    },
    studentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  // Add associations with UPPERCASE model names to match your index.js
  StudentEvent.associate = (models) => {
    StudentEvent.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });
    StudentEvent.belongsTo(models.Event, {
      foreignKey: "eventId",
      as: "Event",  // Use uppercase to match your controller
    });
  };

  return StudentEvent;
};