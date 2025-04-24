module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("unread", "read"),
            allowNull: false,
            defaultValue: "unread",
        },
        recipientId: {
            type: Sequelize.INTEGER,
            allowNull: false, // This associates notifications with a specific admin or user
        },
        type: {
            type: Sequelize.ENUM("experience_approval", "event_update", "general", "task_completion"),
            allowNull: false,
            defaultValue: "general",
        },

        experienceId: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          eventId: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          taskId: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          studentId: { type: Sequelize.INTEGER, allowNull: true }, 

          
    });  

    return Notification;
};
