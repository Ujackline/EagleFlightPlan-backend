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
db.Resume = require("./resume.model.js")(sequelize, Sequelize);
db.Session = require("./session.model.js")(sequelize, Sequelize);
db.Education = require("./education.model.js")(sequelize, Sequelize);
db.Skill = require("./skill.model.js")(sequelize, Sequelize);
db.PersonalLink = require("./personalLink.model.js")(sequelize, Sequelize);
db.Experience = require("./experience.model.js")(sequelize, Sequelize);
db.Project = require("./project.model.js")(sequelize, Sequelize);
db.Interest = require("./interest.model.js")(sequelize, Sequelize);
db.AwardCertification = require("./awardCertification.model.js")(sequelize, Sequelize);
db.ContactInfo =require("./contactInfo.model.js")(sequelize, Sequelize);
db.Comment = require("./comment.model.js")(sequelize, Sequelize);
//db.Request = require("./request.model.js")(sequelize, Sequelize);

// Associations

db.FlightPlan.belongsToMany(db.Experience, { through: "flightplanexperiences", as: "experience", foreignKey: "id" });
db.Experience.belongsToMany(db.FlightPlan, { through: "flightplanexperiences", as: "flightplan", foreignKey: "id" });


// FlightPlan - Task (Many-to-Many)
db.FlightPlan.belongsToMany(db.Task, {through: db.FlightPlanTask, as: "task", foreignKey: "flightPlanId"});
db.Task.belongsToMany(db.FlightPlan, {through: db.FlightPlanTask, as: "flightPlans",foreignKey: "taskId"});


db.Student.belongsToMany(db.Experience, { through: "studentexperiences", as: "experience", foreignKey: "id" });
db.Experience.belongsToMany(db.Student, { through: "studentexperiences", as: "student", foreignKey: "id" });

db.Badge.belongsToMany(db.Experience, { through: "badgeexperiences", as: "experience", foreignKey: "id" });
db.Experience.belongsToMany(db.Badge, { through: "badgeexperiences", as: "badge", foreignKey: "id" });

db.Student.belongsToMany(db.Event, { through: "studentevents", as: "event", foreignKey: "id" });
db.Event.belongsToMany(db.Student, { through: "studentevents", as: "student", foreignKey: "id" });

db.Student.belongsToMany(db.Badge, { through: "studentbadges", as: "badge", foreignKey: "id" });
db.Badge.belongsToMany(db.Student, { through: "studentbadges", as: "student", foreignKey: "id" });

// Student - Task (Many-to-Many)
db.Student.belongsToMany(db.Task, { through: db.StudentTask, as: "task", foreignKey: "studentId" });
db.Task.belongsToMany(db.Student, { through: db.StudentTask, as: "students", foreignKey: "taskId" });

db.Student.belongsToMany(db.Award, { through: "studentawards", as: "awards", foreignKey: "id" });
db.Award.belongsToMany(db.Student, { through: "studentawards", as: "student", foreignKey: "id" });

// Badge - Task (Many-to-Many)
db.Badge.belongsToMany(db.Task, { through: db.BadgeTask, as: "task", foreignKey: "badgeId" });
db.Task.belongsToMany(db.Badge, { through: db.BadgeTask, as: "badges", foreignKey: "taskId" });

// FlightPlan and Student (One-to-Many)
db.FlightPlan.hasMany(db.Student, { as: db.Student.fname, foreignKey: "id", onDelete: "CASCADE" });
db.Student.belongsTo(db.FlightPlan, { as: db.FlightPlan.name, foreignKey: "id", onDelete: "CASCADE" });

db.Event.hasMany(db.Experience, { as: db.Experience.name, foreignKey: "id", onDelete: "CASCADE" });
db.Experience.belongsTo(db.Event, { as: db.Event.name, foreignKey: "id", onDelete: "CASCADE" });

db.Admin.hasMany(db.Event, { as: db.Event.name, foreignKey: "id", onDelete: "CASCADE" });
db.Event.belongsTo(db.Admin, { as: db.Admin.name, foreignKey: "id", onDelete: "CASCADE" });

// admin - studentExperiences (maybe change from as TO through)
db.Admin.hasMany(db.StudentExperiences, { as: db.StudentExperiences.name, foreignKey: "id", onDelete: "CASCADE" });
db.StudentExperiences.belongsTo(db.Admin, { as: db.Admin.name, foreignKey: "id", onDelete: "CASCADE" });

db.Admin.hasMany(db.StudentAwards, { as: db.StudentAwards.name, foreignKey: "id", onDelete: "CASCADE" });
db.StudentAwards.belongsTo(db.Admin, { as: db.Admin.name, foreignKey: "id", onDelete: "CASCADE" });

db.Admin.hasMany(db.StudentTasks, { as: db.StudentTasks.name, foreignKey: "id", onDelete: "CASCADE" });
db.StudentTasks.belongsTo(db.Admin, { as: db.Admin.name, foreignKey: "id", onDelete: "CASCADE" });


module.exports = db;
