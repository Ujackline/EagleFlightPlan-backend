module.exports = (sequelize, Sequelize) => {
  const Semester = sequelize.define("semester", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: this.start_date
      }
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    academic_year: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\d{4}-\d{4}$/  // Validates format like "2023-2024"
      }
    }
  }, {
    hooks: {
      // Ensure only one semester is active at a time
      beforeCreate: async (semester) => {
        if (semester.is_active) {
          await Semester.update(
            { is_active: false }, 
            { where: { is_active: true } }
          );
        }
      },
      beforeUpdate: async (semester) => {
        if (semester.is_active) {
          await Semester.update(
            { is_active: false }, 
            { where: { is_active: true, id: { [Sequelize.Op.ne]: semester.id } } }
          );
        }
      }
    }
  });

  Semester.associate = (models) => {
    // Current Semester Association
    Semester.hasMany(models.Student, {
      foreignKey: 'currentSemesterId',
      as: 'currentStudents'
    });

    // Graduation Semester Association
    Semester.hasMany(models.Student, {
      foreignKey: 'gradSemesterId',
      as: 'graduatingStudents'
    });

    // Many-to-Many relationship with Students
    Semester.belongsToMany(models.Student, {
      through: models.StudentSemester,
      as: 'enrolledStudents',
      foreignKey: 'semesterId'
    });
  };

  return Semester;
};