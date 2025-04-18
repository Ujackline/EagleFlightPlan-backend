module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required'
        },
        notEmpty: {
          msg: 'First name cannot be empty'
        }
      }
    },
    lName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name is required'
        },
        notEmpty: {
          msg: 'Last name cannot be empty'
        }
      }
    },
    studentID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'This student ID is already in use'
      },
      validate: {
        notNull: {
          msg: 'Student ID is required'
        },
        notEmpty: {
          msg: 'Student ID cannot be empty'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'This email is already in use'
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        },
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    major: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Major is required'
        },
        notEmpty: {
          msg: 'Major cannot be empty'
        }
      }
    },
    cliftonstrengths: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Clifton Strengths are required'
        },
        notEmpty: {
          msg: 'Clifton Strengths cannot be empty'
        }
      }
    },
    points: {
      type: Sequelize.INTEGER,  
      allowNull: true,
      defaultValue: 0
    },
    currentSemesterId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },
    gradSemesterId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'semesters',
        key: 'id'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    // More detailed indexes
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['studentID']
      }
    ],
    // Hooks for debugging and data preparation
    hooks: {
      beforeValidate: (student, options) => {
        // Trim whitespace from string fields
        if (student.fName) student.fName = student.fName.trim();
        if (student.lName) student.lName = student.lName.trim();
        if (student.studentID) student.studentID = student.studentID.trim();
        if (student.email) student.email = student.email.trim();
        if (student.major) student.major = student.major.trim();
        if (student.cliftonstrengths) student.cliftonstrengths = student.cliftonstrengths.trim();

        console.log('Before Validate Hook:', student.toJSON());
      },
      beforeCreate: (student, options) => {
        // Ensure points is initialized
        if (student.points === null || student.points === undefined) {
          student.points = 0;
        }
        console.log('Before Create Hook:', student.toJSON());
      }
    }
  });

  // Setup associations
  Student.associate = (models) => {
    // Association with User
    Student.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Associations with Semesters
    Student.belongsTo(models.Semester, {
      foreignKey: 'currentSemesterId',
      as: 'currentSemester'
    });

    Student.belongsTo(models.Semester, {
      foreignKey: 'gradSemesterId',
      as: 'graduationSemester'
    });

    // Other potential associations
    Student.hasMany(models.FlightPlan, {
      foreignKey: 'studentId',
      as: 'flightPlans'
    });
  };

  return Student;
};