module.exports = (sequelize, Sequelize) => {
  const StudentSemester = sequelize.define("StudentSemester", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    is_current: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      set(value) {
        if (value === true) {
          this.setDataValue('is_current', true);
        } else {
          this.setDataValue('is_current', false);
        }
      }
    },
    enrollment_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      validate: {
        isDate: true
      }
    },
    credits_earned: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 24
      }
    },
    status: {
      type: Sequelize.ENUM('active', 'completed', 'planned', 'withdrawn'),
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'completed', 'planned', 'withdrawn']]
      }
    },
    gpa: {
      type: Sequelize.FLOAT,
      validate: {
        min: 0.0,
        max: 4.0
      }
    }
  }, {
    hooks: {
      beforeCreate: async (studentSemester) => {
        if (studentSemester.is_current) {
          await sequelize.models.StudentSemester.update(
            { is_current: false },
            { 
              where: { 
                studentId: studentSemester.studentId,
                id: { [Sequelize.Op.ne]: studentSemester.id } 
              } 
            }
          );
        }
      },
      beforeUpdate: async (studentSemester) => {
        if (studentSemester.is_current && studentSemester.changed('is_current')) {
          await sequelize.models.StudentSemester.update(
            { is_current: false },
            { 
              where: { 
                studentId: studentSemester.studentId,
                id: { [Sequelize.Op.ne]: studentSemester.id } 
              } 
            }
          );
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'semesterId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['is_current']
      }
    ]
  });

  return StudentSemester;
};