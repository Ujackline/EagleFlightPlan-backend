module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      event_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      start_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      end_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      major: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Event;
  };