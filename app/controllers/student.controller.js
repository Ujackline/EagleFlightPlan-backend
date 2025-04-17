const db = require("../models");
const Student = db.Student;
const User = db.User;
const Op = db.Sequelize.Op;
const FlightPlan = db.FlightPlan;
const Semester = db.Semester;
const Task = db.Task;
const FlightPlanTask = db.FlightPlanTask;

exports.create = async (req, res) => {
  try {
    console.log("Received student creation request:", JSON.stringify(req.body, null, 2));

    // Find the user associated with the email
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      return res.status(400).send({
        message: "No user found with this email",
        email: req.body.email
      });
    }

    // Check if a student already exists for this user
    const existingStudent = await Student.findOne({
      where: { 
        [Op.or]: [
          { userId: user.id },
          { email: req.body.email },
          { studentID: req.body.studentID }
        ]
      }
    });

    if (existingStudent) {
      return res.status(400).send({
        message: "A student profile already exists for this user",
        existingStudent: {
          id: existingStudent.id,
          email: existingStudent.email,
          studentID: existingStudent.studentID
        }
      });
    }

    // Validate semesters
    const currentSemester = await Semester.findByPk(req.body.currentSemesterId);
    const gradSemester = await Semester.findByPk(req.body.gradSemesterId);

    if (!currentSemester || !gradSemester) {
      return res.status(400).send({ 
        message: "Invalid semester IDs",
        currentSemesterId: req.body.currentSemesterId,
        gradSemesterId: req.body.gradSemesterId
      });
    }

    // Prepare student data
    const studentData = {
      fName: req.body.fName.trim(),
      lName: req.body.lName.trim(),
      studentID: req.body.studentID.trim(),
      email: req.body.email.trim(),
      major: req.body.major.trim(),
      currentSemesterId: currentSemester.id,
      gradSemesterId: gradSemester.id,
      cliftonstrengths: req.body.cliftonstrengths.trim(),
      userId: user.id,
      points: 0
    };

    // Create student record
    const student = await Student.create(studentData);

    // Create a flight plan for the student based on their current semester
    const semesterTasks = await Task.findAll({
      where: { semesterId: currentSemester.id }
    });

    console.log(`Found ${semesterTasks.length} tasks for semester ${currentSemester.id}`);

    // Create the flight plan
    const flightPlan = await FlightPlan.create({
      name: `${student.fName}'s Flight Plan - ${currentSemester.name}`,
      studentId: student.id,
      semesterId: currentSemester.id
    });

    // Link tasks to the flight plan if there are any
    if (semesterTasks.length > 0) {
      const flightPlanTasks = semesterTasks.map(task => ({
        flightPlanId: flightPlan.id,
        taskId: task.id,
        status: 'incomplete',
        semester: currentSemester.name
      }));
      
      await FlightPlanTask.bulkCreate(flightPlanTasks);
      console.log(`Created ${flightPlanTasks.length} flight plan tasks`);
    } else {
      console.log("No tasks found for this semester. Creating empty flight plan.");
    }

    // Update the student with the flight plan ID
    await student.update({ flightPlanId: flightPlan.id });

    return res.status(201).json({
      message: "Student profile and flight plan created successfully",
      student,
      flightPlan,
      userAssociated: true
    });

  } catch (error) {
    console.error("Comprehensive Error in Student Creation:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      errors: error.errors ? error.errors.map(e => ({
        message: e.message,
        type: e.type,
        path: e.path,
        value: e.value
      })) : 'No specific errors'
    });

    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({
        message: "Validation Error",
        errors: error.errors.map(e => ({
          message: e.message,
          field: e.path
        }))
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({
        message: "A student with a unique field already exists",
        duplicateFields: error.errors.map(e => e.path)
      });
    }

    return res.status(500).send({
      message: "Unexpected error processing student profile",
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : null
    });
  }
};

// Method to handle student semester changes and update flight plan
exports.changeSemester = async (req, res) => {
  try {
    const { studentId, newSemesterId } = req.body;
    
    if (!studentId || !newSemesterId) {
      return res.status(400).send({ message: "Student ID and new semester ID are required" });
    }
    
    // Find the student
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    
    // Find the semester
    const semester = await Semester.findByPk(newSemesterId);
    if (!semester) {
      return res.status(404).send({ message: "Semester not found" });
    }
    
    // Get the tasks for the new semester
    const semesterTasks = await Task.findAll({
      where: { semesterId: newSemesterId }
    });
    
    // Create a new flight plan
    const flightPlan = await FlightPlan.create({
      name: `${student.fName}'s Flight Plan - ${semester.name}`,
      studentId: student.id,
      semesterId: newSemesterId
    });
    
    // Link tasks to the flight plan if there are any
    if (semesterTasks.length > 0) {
      const flightPlanTasks = semesterTasks.map(task => ({
        flightPlanId: flightPlan.id,
        taskId: task.id,
        status: 'incomplete',
        semester: semester.name
      }));
      
      await FlightPlanTask.bulkCreate(flightPlanTasks);
    }
    
    // Update the student with the new semester and flight plan
    await student.update({
      currentSemesterId: newSemesterId,
      flightPlanId: flightPlan.id
    });
    
    return res.status(200).json({
      message: "Student semester and flight plan updated successfully",
      student,
      flightPlan
    });
    
  } catch (error) {
    console.error("Error changing student semester:", error);
    return res.status(500).send({
      message: "Error updating student semester",
      error: error.message
    });
  }
};

exports.findAll = (req, res) => {
    const id = req.params.id;
    Student.findAll({where: {id: id}})
        .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Student for student with id=${id}.`,
          });
        }
        })
      .catch((err) => {
        res.status(500).send({message:err.message ||"Error retrieving Projects for student with id=" 
        });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find student with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving student with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Student.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "student was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating student with id=" + id,
      });
    });
};


exports.getPoints = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  res.json({ points: student.points });
};

exports.addPoints = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  student.points += amount;
  await student.save();

  res.json({ message: 'Points added', points: student.points });
};

exports.redeemPoints = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  if (student.points < amount) {
    return res.status(400).json({ error: 'Not enough points' });
  }

  student.points -= amount;
  await student.save();

  res.json({ message: 'Points redeemed', points: student.points });
};


// Get current logged-in student from session/token
exports.getCurrentStudent = (req, res) => {
  // Check if user is authenticated
  if (req.user) {
    // If user data is stored in req.user from your auth middleware
    Student.findOne({ where: { userId: req.user.id } })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: "Current user not found in database"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Error retrieving current user"
        });
      });
  } else {
    // If you're using JWT tokens stored in the request
    const token = req.headers["x-access-token"] || req.headers.authorization;
    
    if (!token) {
      return res.status(401).send({
        message: "No authentication token provided"
      });
    }
    
    try {
      // You'll need to implement this function based on your auth system
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      Student.findOne({ where: { userId: decoded.id } })
        .then(data => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: "Current user not found in database"
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Error retrieving current user"
          });
        });
    } catch (err) {
      return res.status(401).send({
        message: "Invalid or expired token"
      });
    }
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  
  try {
    await Student.destroy({ where: { userId: id } });
    
    // Then delete the user
    const deleted = await User.destroy({ where: { id: id } });
    
    if (deleted) {
      res.send({ message: "User was deleted successfully!" });
    } else {
      res.status(404).send({ 
        message: `Cannot delete User with id=${id}. User not found!` 
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete User with id=" + id,
      error: err.message
    });
  }
};

// Update current student's profile
exports.updateCurrentStudentProfile = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

   
    const { 
      major, 
      currentSemesterId, 
      gradSemesterId, 
      cliftonstrengths 
    } = req.body;

    // Validate required fields
    if (!major || !currentSemesterId || !gradSemesterId || !cliftonstrengths) {
      return res.status(400).json({ 
        message: "Missing required profile fields" 
      });
    }

    // Get the student
    const student = await Student.findOne({ where: { userId: req.user.id } });
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    // Check if semester is changing
    const needsNewFlightPlan = student.currentSemesterId !== parseInt(currentSemesterId);
    
    // Update the student record
    const [updatedRowsCount] = await Student.update(
      {
        major,
        currentSemesterId,
        gradSemesterId,
        cliftonstrengths
      },
      {
        where: { userId: req.user.id },
        returning: true
      }
    );

    // If semester changed, create a new flight plan
    if (needsNewFlightPlan) {
      // Find the new semester
      const semester = await Semester.findByPk(currentSemesterId);
      
      // Get tasks for this semester
      const semesterTasks = await Task.findAll({
        where: { semesterId: currentSemesterId }
      });
      
      // Create new flight plan
      const flightPlan = await FlightPlan.create({
        name: `${student.fName}'s Flight Plan - ${semester.name}`,
        studentId: student.id,
        semesterId: currentSemesterId
      });
      
      // Link tasks to flight plan
      if (semesterTasks.length > 0) {
        const flightPlanTasks = semesterTasks.map(task => ({
          flightPlanId: flightPlan.id,
          taskId: task.id,
          status: 'incomplete',
          semester: semester.name
        }));
        
        await FlightPlanTask.bulkCreate(flightPlanTasks);
      }
      
      // Update student with new flight plan
      await student.update({ flightPlanId: flightPlan.id });
    }

    // Fetch the updated student record
    const updatedStudent = await Student.findOne({ 
      where: { userId: req.user.id },
      include: [
        {
          model: FlightPlan,
          as: 'flightPlan'
        },
        {
          model: Semester,
          as: 'currentSemester'
        },
        {
          model: Semester,
          as: 'graduationSemester'
        }
      ]
    });

    // Respond with updated student data
    res.json({
      message: needsNewFlightPlan ? 
        "Profile and flight plan updated successfully" : 
        "Profile updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ 
      message: "Error updating student profile",
      error: error.message 
    });
  }
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  Student.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Students were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};