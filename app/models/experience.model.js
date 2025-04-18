module.exports = (sequelize, Sequelize) => {
  const Experience = sequelize.define("experience", {
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
          allowNull: false,
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: true,
      },
      type: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      cliftonStrength: {
          type: Sequelize.STRING,
          allowNull: true,
      },

      semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      major: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      reflectionRequired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      points: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
      },
      badge: {
          type: Sequelize.STRING,
          allowNull: true,
      },
  });

  return Experience;
};
