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
        notEmpty: true,
        len: [3, 50]
      }
    },
    code: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[A-Z0-9]{3,10}$/i
      }
    },
    start_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: {
          args: [new Date('2000-01-01').toISOString()],
          msg: "Start date must be after 2000"
        }
      }
    },
    end_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (new Date(value) <= new Date(this.start_date)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      set(value) {
        if (value === true) {
          this.setDataValue('is_active', true);
        } else {
          this.setDataValue('is_active', false);
        }
      }
    },
    academic_year: {
      type: Sequelize.STRING(9),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\d{4}-\d{4}$/,
        isValidYear(value) {
          const [startYear, endYear] = value.split('-').map(Number);
          if (endYear !== startYear + 1) {
            throw new Error('Academic year must span exactly one year (e.g., 2023-2024)');
          }
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: async (semester) => {
        if (semester.is_active) {
          await Semester.update({ is_active: false }, { where: {} });
        }
      },
      beforeUpdate: async (semester) => {
        if (semester.is_active && semester.changed('is_active')) {
          await Semester.update({ is_active: false }, { 
            where: { id: { [Sequelize.Op.ne]: semester.id } } 
          });
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['start_date']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  Semester.associate = (models) => {
    Semester.hasMany(models.FlightPlan, {
      foreignKey: 'semesterId',
      as: 'flightPlans'
    });
    
    Semester.hasMany(models.Student, {
      foreignKey: 'currentSemesterId',
      as: 'currentStudents'
    });
    
    Semester.hasMany(models.Student, {
      foreignKey: 'gradSemesterId',
      as: 'graduatingStudents'
    });
    
    Semester.belongsToMany(models.Student, {
      through: models.StudentSemester,
      as: 'enrolledStudents',
      foreignKey: 'semesterId'
    });
  };

  // Class Methods
  Semester.getCurrentSemester = async function() {
    return await this.findOne({ where: { is_active: true } });
  };

  return Semester;
};