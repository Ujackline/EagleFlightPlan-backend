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

// Bridge Tables
db.FlightPlanExperience = require("./flightplanexperience.model.js")(sequelize, Sequelize);
db.FlightPlanTask = require("./flightplantask.model.js")(sequelize, Sequelize);
db.BadgeExperience = require("./badgeexperience.model.js")(sequelize, Sequelize);
db.BadgeTask = require("./badgetask.model.js")(sequelize, Sequelize);
db.StudentExperience = require("./studentexperience.model.js")(sequelize, Sequelize);
db.StudentEvent = require("./studentevent.model.js")(sequelize, Sequelize);
db.StudentBadge = require("./studentbadge.model.js")(sequelize, Sequelize);
db.StudentAward = require("./studentaward.model.js")(sequelize, Sequelize);
db.StudentTask = require("./studenttask.model.js")(sequelize, Sequelize);
db.FlightPlanEvent = require("./flightplanevent.model.js")(sequelize, Sequelize);


// ASSOCIATIONS

// 2. FLIGHT PLAN RELATIONSHIPS
db.FlightPlan.belongsToMany(db.Task, {through: {model: db.FlightPlanTask, unique: false,scope: {relationType: 'flightplan_task'}
  },
  as: "tasks",
  foreignKey: "flightPlanId"
});
db.Task.belongsToMany(db.FlightPlan, {
  through: db.FlightPlanTask,
  as: "flightPlans",
  foreignKey: "taskId"
});

// In StudentExperience model or setup
db.StudentExperience.belongsTo(db.Experience, {foreignKey: 'experienceId', as: 'experience'});
db.FlightPlan.belongsToMany(db.Experience, {
  through: db.FlightPlanExperience,
  as: "experiences",
  foreignKey: "flightPlanId"
});
db.Experience.belongsToMany(db.FlightPlan, {
  through: db.FlightPlanExperience,
  as: "flightPlans",
  foreignKey: "experienceId"
});

// 3. STUDENT PROGRESS RELATIONSHIPS
db.Student.belongsToMany(db.Task, {
  through: {
    model: db.StudentTask,
    unique: false,
    scope: {
      relationType: 'student_task'
    }
  },
  as: "tasks",
  foreignKey: "studentId"
});
db.Task.belongsToMany(db.Student, {
  through: db.StudentTask,
  as: "students",
  foreignKey: "taskId"
});

db.Student.belongsToMany(db.Experience, {
  through: db.StudentExperience,
  as: "experiences",
  foreignKey: "studentId"
});
db.Experience.belongsToMany(db.Student, {
  through: db.StudentExperience,
  as: "students",
  foreignKey: "experienceId"
});

db.Student.belongsToMany(db.Event, {
  through: db.StudentEvent,
  as: "events",
  foreignKey: "studentId"
});
db.Event.belongsToMany(db.Student, {
  through: db.StudentEvent,
  as: "students",
  foreignKey: "eventId"
});

db.Student.belongsToMany(db.Badge, {
  through: db.StudentBadge,
  as: "badges",
  foreignKey: "studentId"
});
db.Badge.belongsToMany(db.Student, {
  through: db.StudentBadge,
  as: "students",
  foreignKey: "badgeId"
});

db.Student.belongsToMany(db.Award, {
  through: db.StudentAward,
  as: "awards",
  foreignKey: "studentId"
});
db.Award.belongsToMany(db.Student, {
  through: db.StudentAward,
  as: "students",
  foreignKey: "awardId"
});

// 4. BADGE RELATIONSHIPS
db.Badge.belongsToMany(db.Task, {
  through: db.BadgeTask,
  as: "tasks",
  foreignKey: "badgeId"
});
db.Task.belongsToMany(db.Badge, {
  through: db.BadgeTask,
  as: "badges",
  foreignKey: "taskId"
});

db.Badge.belongsToMany(db.Experience, {
  through: db.BadgeExperience,
  as: "experiences",
  foreignKey: "badgeId"
});
db.Experience.belongsToMany(db.Badge, {
  through: db.BadgeExperience,
  as: "badges",
  foreignKey: "experienceId"
});

// 5. EVENT RELATIONSHIPS
db.Admin.hasMany(db.Event, {
  as: "events",
  foreignKey: "adminId",
  onDelete: "CASCADE"
});
db.Event.belongsTo(db.Admin, {
  as: "admin",
  foreignKey: "adminId"
});

db.Event.hasMany(db.Experience, {
  as: "experiences",
  foreignKey: "eventId",
  onDelete: "CASCADE"
});
db.Experience.belongsTo(db.Event, {
  as: "event",
  foreignKey: "eventId"
});

db.StudentEvent.belongsTo(db.Student, { foreignKey: "studentId", as: "student" });
db.StudentEvent.belongsTo(db.Event, { foreignKey: "eventId", as: "event" });

// Many-to-many: FlightPlan <-> Event
db.FlightPlan.belongsToMany(db.Event, {through: db.FlightPlanEvent, as: "events",foreignKey: "flightPlanId"});

db.Event.belongsToMany(db.FlightPlan, {through: db.FlightPlanEvent, as: "flightPlans",foreignKey: "eventId"});


module.exports = db;