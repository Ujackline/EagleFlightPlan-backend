// Updated FlightPlan Controller (flightplan.controller.js)

const db = require("../models"); // Import models
const FlightPlan = db.FlightPlan; // Get FlightPlan model
const Student = db.Student; // Import Student model
const Task = db.Task; // Import Task model
const Op = db.Sequelize.Op; // Sequelize operators for queries

// **1. Create a new FlightPlan**
exports.create = async (req, res) => {
  // Validate required fields
  if (!req.body.name || !req.body.semester || !req.body.grad_semester || !req.body.studentId) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  try {
    // Find the student to ensure they exist
    const student = await Student.findByPk(req.body.studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Calculate student's current year with specific semester
    const studentYear = calculateStudentYear(req.body.semester, req.body.grad_semester);

    // Check if a flight plan already exists for this semester and student
    const existingFlightPlan = await FlightPlan.findOne({
      where: { 
        semester: req.body.semester,
        studentId: req.body.studentId
      }
    });

    // If flight plan already exists, return it
    if (existingFlightPlan) {
      return res.status(200).send(existingFlightPlan);
    }

    // Create new flight plan
    const flightPlan = {
      name: req.body.name,
      semester: req.body.semester,
      grad_semester: req.body.grad_semester,
      studentYear: studentYear,
      studentId: req.body.studentId,
      progress: 0
    };

    // Create and save the flight plan
    const createdFlightPlan = await FlightPlan.create(flightPlan);
    
    // Fetch tasks for the student's current year
    const yearTasks = await Task.findAll({
      where: { 
        applicableYear: studentYear 
      }
    });

    // Create associations in the bridge table
    if (yearTasks.length > 0) {
      const flightPlanTasks = yearTasks.map(task => ({
        flightPlanId: createdFlightPlan.id,
        taskId: task.id,
        status: 'Incomplete',
        points: task.NumOfPoints || 0
      }));

      await db.FlightPlanTask.bulkCreate(flightPlanTasks);
    }
    
    res.status(201).send(createdFlightPlan);
  } catch (err) {
    console.error('Error creating flight plan:', err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the FlightPlan.",
      error: err
    });
  }
};


function calculateStudentYear(currentSemester, graduationSemester) {
  const semesterOrder = ['Spring', 'Summer', 'Fall'];
  
  const [currentSem, currentYear] = currentSemester.split(' ');
  const [gradSem, gradYear] = graduationSemester.split(' ');
  
  const currentSemIndex = semesterOrder.indexOf(currentSem);
  const gradSemIndex = semesterOrder.indexOf(gradSem);
  
  const currentSemNum = parseInt(currentYear) * 3 + currentSemIndex;
  const gradSemNum = parseInt(gradYear) * 3 + gradSemIndex;
  
  const remainingSemesters = gradSemNum - currentSemNum;
  
  // Determine base year
  let baseYear = 'Freshman';
  if (remainingSemesters <= 6) baseYear = 'Sophomore';
  if (remainingSemesters <= 4) baseYear = 'Junior';
  if (remainingSemesters <= 2) baseYear = 'Senior';
  
  // Special case: Senior doesn't have summer
  if (baseYear === 'Senior' && currentSem === 'Summer') {
    return 'Senior Spring'; // or another appropriate value
  }
  
  // Combine base year with specific semester
  return `${baseYear} ${currentSem}`;
}


// Add this function to your flightplan.controller.js
exports.calculateYearForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { currentSemester, gradSemester } = req.query;
    
    // Validate the inputs
    if (!currentSemester || !gradSemester) {
      return res.status(400).send({ 
        message: "Current semester and graduation semester are required" 
      });
    }
    
    // Find the student to ensure they exist
    const student = await db.Student.findByPk(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    
    // Calculate the student's year
    const studentYear = calculateStudentYear(currentSemester, gradSemester);
    
    // Return the calculated year
    res.status(200).send({ studentYear });
  } catch (error) {
    console.error('Error calculating student year:', error);
    res.status(500).send({
      message: "Error calculating student year",
      error: error.message
    });
  }
};
// **2. Retrieve all FlightPlans**
exports.findAll = (req, res) => {
  FlightPlan.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving FlightPlans." })
    );
};

// **3. Retrieve a FlightPlan by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  FlightPlan.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find FlightPlan with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving FlightPlan with id=" + id })
    );
};

// **4. Find flight plans by student ID**
exports.findByStudent = (req, res) => {
  const studentId = req.params.studentId;

  FlightPlan.findAll({ 
    where: { studentId: studentId },
    order: [['createdAt', 'DESC']] // Order by creation date, newest first
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving FlightPlans for student ID: " + studentId
      });
    });
};

// **5. Find flight plan by student ID and semester**
exports.findByStudentAndSemester = async (req, res) => {
  const { studentId, semester } = req.params;

  try {
    // Find student
    const student = await db.Student.findByPk(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Find flight plan
    let flightPlan = await FlightPlan.findOne({
      where: { 
        studentId: studentId,
        semester: semester
      }
    });

    if (!flightPlan) {
      // Determine student's academic year with specific semester
      const studentYear = calculateStudentYear(semester, student.grad_semester);

      // Create new flight plan if none exists
      flightPlan = await FlightPlan.create({
        name: `${student.fName}'s Flight Plan - ${semester}`,
        semester: semester,
        grad_semester: student.grad_semester,
        studentId: studentId,
        studentYear: studentYear,
        progress: 0
      });

      // Find applicable tasks
      const applicableTasks = await db.Task.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { applicableYear: studentYear },
            { applicableYear: studentYear.split(' ')[0] }, // Base year for backward compatibility
            { applicableYear: null }, // Tasks for all
            { 
              majors: {
                [db.Sequelize.Op.or]: [
                  { [db.Sequelize.Op.like]: `%${student.major}%` },
                  null
                ]
              }
            }
          ]
        }
      });

      // Create FlightPlanTasks entries
      if (applicableTasks.length > 0) {
        const flightPlanTasks = applicableTasks.map(task => ({
          flightPlanId: flightPlan.id,
          taskId: task.id,
          status: 'Incomplete',
          points: task.NumOfPoints || 0,
          semester: semester
        }));

        await db.FlightPlanTask.bulkCreate(flightPlanTasks);
      }
    } else {
      // Get existing flight plan's tasks
      const existingTasks = await db.FlightPlanTask.findAll({
        where: { flightPlanId: flightPlan.id }
      });

      // Check if we need to add new tasks based on studentYear
      if (existingTasks.length === 0) {
        const applicableTasks = await db.Task.findAll({
          where: {
            [db.Sequelize.Op.or]: [
              { applicableYear: flightPlan.studentYear },
              { applicableYear: flightPlan.studentYear.split(' ')[0] },
              { applicableYear: null },
              { 
                majors: {
                  [db.Sequelize.Op.or]: [
                    { [db.Sequelize.Op.like]: `%${student.major}%` },
                    null
                  ]
                }
              }
            ]
          }
        });

        if (applicableTasks.length > 0) {
          const flightPlanTasks = applicableTasks.map(task => ({
            flightPlanId: flightPlan.id,
            taskId: task.id,
            status: 'Incomplete',
            points: task.NumOfPoints || 0,
            semester: semester
          }));

          await db.FlightPlanTask.bulkCreate(flightPlanTasks);
        }
      }
    }

    res.status(200).send(flightPlan);
  } catch (error) {
    console.error('Error processing flight plan:', error);
    res.status(500).send({
      message: "Error processing flight plan",
      error: error.message
    });
  }
};

// **6. Update a FlightPlan**
exports.update = (req, res) => {
  const id = req.params.id;

  FlightPlan.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "FlightPlan was updated successfully." });
      else res.send({ message: `Cannot update FlightPlan with id=${id}. Maybe FlightPlan was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating FlightPlan with id=" + id })
    );
};

// **7. Delete a FlightPlan**
exports.delete = (req, res) => {
  const id = req.params.id;

  FlightPlan.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "FlightPlan was deleted successfully!" });
      else res.send({ message: `Cannot delete FlightPlan with id=${id}. Maybe FlightPlan was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete FlightPlan with id=" + id })
    );
};

// **8. Method to get tasks for a specific flight plan**
exports.getFlightPlanTasks = async (req, res) => {
  const flightPlanId = req.params.id;

  try {
    // Fetch tasks through FlightPlanTasks
    const flightPlanTasks = await db.FlightPlanTask.findAll({
      where: { flightPlanId: flightPlanId },
      include: [{ model: db.Task, as: 'task' }]
    });

    // Format tasks for frontend
    const formattedTasks = flightPlanTasks.map(fpt => ({
      id: fpt.taskId,
      name: fpt.task.taskName,
      description: fpt.task.description,
      category: fpt.task.category,
      NumOfPoints: fpt.points,
      completed: fpt.task.completed,
      status: fpt.task.status
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching flight plan tasks:', error);
    res.status(500).send({
      message: "Error retrieving tasks",
      error: error.message
    });
  }
};

// **9. Delete all FlightPlans**
exports.deleteAll = (req, res) => {
  FlightPlan.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} FlightPlans were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all FlightPlans." })
    );
};