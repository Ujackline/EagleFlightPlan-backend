const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Session = require("./session.model.js")(sequelize, Sequelize);
db.Admin = require("./admin.model.js")(sequelize, Sequelize);
db.Award = require("./award.model.js")(sequelize, Sequelize);
db.Badge = require("./badge.model.js")(sequelize, Sequelize);
db.Experience = require("./experience.model.js")(sequelize, Sequelize);
db.FlightPlan = require("./flightplan.model.js")(sequelize, Sequelize);
db.Task = require("./task.model.js")(sequelize, Sequelize);
db.Student = require("./student.model.js")(sequelize, Sequelize);
db.Event = require("./event.model.js")(sequelize, Sequelize);
db.Notification = require("./notification.model.js")(sequelize, Sequelize);
db.Semester = require("./semester.model.js")(sequelize, Sequelize); 

// Bridge Tables
db.FlightPlanExperience = require("./flightplanexperience.model.js")(sequelize, Sequelize);
db.FlightPlanTask = require("./flightplantask.model.js")(sequelize, Sequelize);
db.BadgeExperience = require("./badgeexperience.model.js")(sequelize, Sequelize);
db.BadgeTask = require("./badgetask.model.js")(sequelize, Sequelize);
db.StudentExperience = require("./studentexperience.model.js")(sequelize, Sequelize);
db.StudentEvent = require("./studentevent.model.js")(sequelize, Sequelize);
db.StudentBadge = require("./studentbadge.model.js")(sequelize, Sequelize);
db.StudentAward= require("./studentaward.model.js")(sequelize, Sequelize);
db.StudentTask = require("./studenttask.model.js")(sequelize, Sequelize);
db.Notification= require("./notification.model.js")(sequelize, Sequelize);
db.StudentSemester = require("./studentsemester.model.js")(sequelize, Sequelize);

// Associations

// FlightPlan - Experience (Many-to-Many)
db.FlightPlan.belongsToMany(db.Experience, { through: db.FlightPlanExperience, as: "experiences", foreignKey: "flightPlanId" });
db.Experience.belongsToMany(db.FlightPlan, { through: db.FlightPlanExperience, as: "flightPlans", foreignKey: "experienceId" });

// FlightPlan - Task (Many-to-Many) - Uncomment and fix this association
db.FlightPlan.belongsToMany(db.Task, { through: db.FlightPlanTask, as: "tasks", foreignKey: "flightPlanId" });
db.Task.belongsToMany(db.FlightPlan, { through: db.FlightPlanTask, as: "flightPlans", foreignKey: "taskId" });

// Student - Experience (Many-to-Many)
db.Student.belongsToMany(db.Experience, { through: db.StudentExperience, as: "experiences", foreignKey: "studentId" });
db.Experience.belongsToMany(db.Student, { through: db.StudentExperience, as: "students", foreignKey: "experienceId" });

// Badge - Experience (Many-to-Many)
db.Badge.belongsToMany(db.Experience, { through: db.BadgeExperience, as: "experiences", foreignKey: "badgeId" });
db.Experience.belongsToMany(db.Badge, { through: db.BadgeExperience, as: "badges", foreignKey: "experienceId" });

// Student - Task (Many-to-Many)
db.Student.belongsToMany(db.Task, { through: db.StudentTask, as: "tasks", foreignKey: "studentId" });
db.Task.belongsToMany(db.Student, { through: db.StudentTask, as: "students", foreignKey: "taskId" });

// Student - Event (Many-to-Many)
db.Student.belongsToMany(db.Event, { through: db.StudentEvent, as: "events", foreignKey: "studentId" });
db.Event.belongsToMany(db.Student, { through: db.StudentEvent, as: "students", foreignKey: "eventId" });

// Student - Badge (Many-to-Many)
db.Student.belongsToMany(db.Badge, { through: db.StudentBadge, as: "badges", foreignKey: "studentId" });
db.Badge.belongsToMany(db.Student, { through: db.StudentBadge, as: "students", foreignKey: "badgeId" });


// Badge - Task (Many-to-Many)
db.Badge.belongsToMany(db.Task, { through: db.BadgeTask, as: "tasks", foreignKey: "badgeId" });
db.Task.belongsToMany(db.Badge, { through: db.BadgeTask, as: "badges", foreignKey: "taskId" });

// Student - Award (Many-to-Many)
db.Student.belongsToMany(db.Award, { through: db.StudentAward, as: "awards", foreignKey: "studentId" });
db.Award.belongsToMany(db.Student, { through: db.StudentAward, as: "students", foreignKey: "awardId" });

// // Badge - Task (Many-to-Many)
// db.Badge.belongsToMany(db.Task, { through: db.BadgeTask, as: "tasks", foreignKey: "badgeId" });
// db.Task.belongsToMany(db.Badge, { through: db.BadgeTask, as: "badges", foreignKey: "taskId" });


// Event - Experience (One-to-Many)
db.Event.hasMany(db.Experience, { as: "experiences", foreignKey: "eventId", onDelete: "CASCADE" });
db.Experience.belongsTo(db.Event, { as: "event", foreignKey: "eventId", onDelete: "CASCADE" });

// Admin - Event (One-to-Many)
db.Admin.hasMany(db.Event, { as: "events", foreignKey: "adminId", onDelete: "CASCADE" });
db.Event.belongsTo(db.Admin, { as: "admin", foreignKey: "adminId", onDelete: "CASCADE" });


// db.FlightPlan.belongsToMany(db.Experience, { through: "flightplanexperiences", as: "experience", foreignKey: "id" });
// db.Experience.belongsToMany(db.FlightPlan, { through: "flightplanexperiences", as: "flightplan", foreignKey: "id" });

// Student - FlightPlan (One-to-Many)
db.Student.hasMany(db.FlightPlan, { as: "flightPlans", foreignKey: "studentId", onDelete: "CASCADE" });
db.FlightPlan.belongsTo(db.Student, { as: "student", foreignKey: "studentId" });

// Semester - FlightPlan (One-to-Many)
db.Semester.hasMany(db.FlightPlan, { as: "flightPlans", foreignKey: "semesterId" });
db.FlightPlan.belongsTo(db.Semester, { as: "semesterInfo", foreignKey: "semesterId" });

// Semester - Task (One-to-Many)
db.Semester.hasMany(db.Task, { as: "tasks", foreignKey: "semesterId" });
db.Task.belongsTo(db.Semester, { as: "semesterInfo", foreignKey: "semesterId" });

// Semester - Event (One-to-Many)
db.Semester.hasMany(db.Event, { as: "events", foreignKey: "semesterId" });
db.Event.belongsTo(db.Semester, { as: "semesterInfo", foreignKey: "semesterId" });

// Student - Semester (Many-to-Many)
db.Student.belongsToMany(db.Semester, {  through: db.StudentSemester, as: "enrolledSemesters", foreignKey: "studentId" });
db.Semester.belongsToMany(db.Student, {  through: db.StudentSemester, as: "enrolledStudents",  foreignKey: "semesterId" });

// Student's current semester (belongsTo)
db.Student.belongsTo(db.Semester, { as: "currentSemester", foreignKey: "currentSemesterId" });

// Student's graduation semester (belongsTo)
db.Student.belongsTo(db.Semester, { as: "graduationSemester", foreignKey: "gradSemesterId" });

module.exports = db;