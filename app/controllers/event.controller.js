const db = require("../models");
const Event = db.Event;
const StudentEvent = db.StudentEvent;
const Student = db.Student;
const Op = db.Sequelize.Op;
const notificationController = require("./notification.controller");

// Helper to format date/time values for database
const formatDateForDB = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};

// 1. Create Event
// 1. Create Event
exports.create = async (req, res) => {
  try {
    console.log("Received event data:", JSON.stringify(req.body, null, 2));
    
    // Validate required fields with more detailed error message
    if (!req.body.name || !req.body.date || !req.body.major || !req.body.semester) {
      console.log("Validation failed:", {
        name: !req.body.name,
        date: !req.body.date,
        major: !req.body.major,
        semester: !req.body.semester
      });
      
      return res.status(400).send({ 
        message: "Required fields cannot be empty!",
        missingFields: {
          name: !req.body.name,
          date: !req.body.date,
          major: !req.body.major,
          semester: !req.body.semester
        }
      });
    }

    // Ensure that the userId is included in the event creation data
    if (!req.user || !req.user.id) {
      return res.status(400).send({
        message: "User not authenticated or invalid user data."
      });
    }

    // Build a complete event object with the data as received
    const eventData = {
      name: req.body.name,
      description: req.body.description || "",
      date: req.body.date,
      location: req.body.location || "",
      major: req.body.major,
      semester: req.body.semester,
      event_type: req.body.event_type || null,
      start_time: req.body.start_time || null,
      end_time: req.body.end_time || null,
      attendance_code: req.body.attendance_code || null,
      userId: req.user.id  // Add authenticated user's ID
    };

    console.log("Creating event with data:", JSON.stringify(eventData, null, 2));
    
    // Create the event in the database
    const event = await Event.create(eventData);
    console.log("Event created successfully:", event.id);
    res.status(201).send(event);
  } catch (err) {
    console.error("Error creating event:", err.message);
    console.error("Error details:", err);
    if (err.name === 'SequelizeValidationError') {
      console.error("Validation errors:", err.errors.map(e => e.message));
      return res.status(400).send({
        message: "Validation error",
        errors: err.errors.map(e => e.message)
      });
    }
    res.status(500).send({
      message: err.message || "Error creating Event."
    });
  }
};


// Keep all the other methods as they are
exports.findAll = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving events." });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findByPk(id, {
      include: [{
        model: Student,
        as: 'students', // Change 'attendees' to 'students' to match your model definition
        through: { attributes: ['status'] }
      }],
      attributes: {
        include: ['attendance_code'] // Ensure this field is included
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Create a plain object to modify
    const eventData = event.get({ plain: true });
    
    // Add the attendanceCode property explicitly
    eventData.attendanceCode = eventData.attendance_code;
    
    res.status(200).json(eventData);
  } catch (err) {
    console.error("Error retrieving event:", err);
    res.status(500).json({ message: "Error retrieving event" });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Event.update(req.body, { 
      where: { id },
      returning: true 
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    const updatedEvent = await Event.findByPk(id);
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error updating event" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Event.destroy({ where: { id } });
    
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    console.log(`Registering student ${studentId} for event ${eventId}`);

    // Check if already registered
    const existingRegistration = await db.StudentEvent.findOne({
      where: { eventId, studentId }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Create with default values for required fields
    const registration = await db.StudentEvent.create({
      eventId,
      studentId,
      status: 'registered',
      pointsEarned: 0,
      reflectionText: ''
    });

    console.log(`Successfully registered student ${studentId} for event ${eventId}`);
    res.status(201).json(registration);
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ 
      message: "Error registering student",
      error: err.message 
    });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;

    const registration = await StudentEvent.findOne({
      where: { eventId, studentId }
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = 'attended';
    await registration.save();

    res.status(200).json({ message: "Attendance recorded" });
  } catch (err) {
    res.status(500).json({ message: "Error recording attendance" });
  }
};

exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await StudentEvent.findAll({
      where: { eventId: req.params.eventId },
      include: [{
        model: Student,
        attributes: ['id', 'fName', 'lName', 'email']
      }]
    });
    
    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
};

exports.findBySemester = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { semester: req.params.semester },
      order: [['date', 'ASC']]
    });
    
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Add this method to generate attendance codes
exports.generateAttendanceCode = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { code } = req.body;
    
    // Find the event
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Update the event with the new attendance code
    event.attendance_code = code;
    await event.save();
    
    res.status(200).json({ 
      success: true,
      code: event.attendance_code 
    });
  } catch (err) {
    console.error("Error generating attendance code:", err);
    res.status(500).json({ 
      message: "Error generating attendance code",
      error: err.message 
    });
  }
};

exports.verifyAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { code } = req.body;
    
    // Find the event
    const event = await Event.findByPk(eventId, {
      attributes: {
        include: ['attendance_code']
      }
    });
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }
    
    // Check code match
    if (!event.attendance_code) {
      return res.status(400).json({ 
        success: false,
        message: "This event doesn't have an attendance code set" 
      });
    }
    
    if (event.attendance_code.trim().toUpperCase() !== code.trim().toUpperCase()) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid attendance code" 
      });
    }
    
    // Find student registration
    const registration = await StudentEvent.findOne({
      where: { eventId, studentId }
    });
    
    if (!registration) {
      return res.status(404).json({ 
        success: false,
        message: "Student is not registered for this event" 
      });
    }
    
    // Mark as pending instead of attended
    registration.status = 'pending';
    registration.attendanceDate = new Date();
    await registration.save();
    
    // Create notification for admin
    try {
      await notificationController.createNotification({
        type: 'attendance_verification',
        message: `Student has verified attendance for ${event.name} and is awaiting approval`,
        recipientRole: 'admin',
        data: {
          eventId,
          studentId,
          eventName: event.name
        }
      });
    } catch (notifyErr) {
      console.error("Error creating admin notification:", notifyErr);
      // Continue even if notification fails
    }
    
    return res.status(200).json({ 
      success: true,
      message: "Attendance verification submitted and awaiting approval" 
    });
    
  } catch (err) {
    console.error("Error verifying attendance:", err);
    return res.status(500).json({ 
      success: false,
      message: "Error verifying attendance",
      error: err.message 
    });
  }
};exports.approveAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { points } = req.body;
    
    // Find the registration
    const registration = await StudentEvent.findOne({
      where: { eventId, studentId }
    });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    // Update status and points
    registration.status = 'attended';
    registration.pointsEarned = points || 50; // Default to 50 if not specified
    await registration.save();
    
    // Create notification for student
    try {
      await notificationController.createNotification({
        type: 'attendance_approved',
        message: `Your attendance for event ${eventId} has been approved! You earned ${registration.pointsEarned} points.`,
        recipientId: studentId,
        data: {
          eventId,
          pointsEarned: registration.pointsEarned
        }
      });
    } catch (notifyErr) {
      console.error("Error creating student notification:", notifyErr);
      // Continue even if notification fails
    }
    
    res.status(200).json({ 
      message: "Attendance approved and points awarded",
      pointsEarned: registration.pointsEarned
    });
    
  } catch (err) {
    console.error("Error approving attendance:", err);
    res.status(500).json({ message: "Error approving attendance" });
  }
};

// NEW METHOD: Cancel a registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    
    // Find the registration record
    const registration = await StudentEvent.findOne({
      where: { eventId, studentId }
    });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    // Delete the registration
    await registration.destroy();
    
    res.status(200).json({ message: "Registration canceled successfully" });
  } catch (err) {
    console.error("Error canceling registration:", err);
    res.status(500).json({ message: "Error canceling registration" });
  }
};
exports.getEventsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const events = await Event.findAll({
      where: { userId: userId },
    });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this user." });
    }

    res.json(events);
  } catch (error) {
    console.error("Error fetching events by userId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getStudentEvents = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // Find events where this student is registered
    const studentEvents = await StudentEvent.findAll({
      where: { studentId: studentId },
      include: [{
        model: Event,
        as: "Event"  // This alias must match the association defined in your models
      }]
    });
    
    // Format the response
    const formattedEvents = studentEvents.map(registration => {
      return {
        ...registration.Event.dataValues,
        status: registration.status,
        attendanceDate: registration.attendanceDate,
        pointsEarned: registration.pointsEarned,
        reflectionText: registration.reflectionText
      };
    });
    
    res.status(200).send(formattedEvents);
  } catch (err) {
    console.error("Error fetching student events:", err);
    res.status(500).send({
      message: err.message || "Error retrieving events for student."
    });
  }
};

exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingAttendances = await StudentEvent.findAll({
      where: { status: 'pending' },
      include: [
        { 
          model: Event,
          as: 'Event'  // This matches your association in StudentEvent model
        },
        { 
          model: Student,
          as: 'student'  // This matches your association in StudentEvent model
        }
      ]
    });
    
    // Format the response data to include necessary information
    const formattedApprovals = pendingAttendances.map(attendance => ({
      eventId: attendance.eventId,
      studentId: attendance.studentId,
      verificationDate: attendance.attendanceDate || attendance.createdAt,
      status: attendance.status,
      eventName: attendance.Event ? attendance.Event.name : 'Unknown Event',
      studentName: attendance.student ? 
        `${attendance.student.fName} ${attendance.student.lName}` : 
        'Unknown Student',
      points: attendance.pointsEarned || 50 // Default to 50 points
    }));
    
    res.status(200).json(formattedApprovals);
  } catch (err) {
    console.error("Error fetching pending approvals:", err);
    res.status(500).json({ message: "Error fetching pending approvals", error: err.message });
  }
};
exports.rejectAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { reason } = req.body;
    
    // Find the registration
    const registration = await StudentEvent.findOne({
      where: { eventId, studentId }
    });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    // Update status
    registration.status = 'rejected';
    await registration.save();
    
    // Create notification for student
    try {
      await notificationController.createNotification({
        type: 'attendance_rejected',
        message: `Your attendance for an event has been rejected.${reason ? ' Reason: ' + reason : ''}`,
        recipientId: studentId,
        data: {
          eventId,
          reason
        }
      });
    } catch (notifyErr) {
      console.error("Error creating student notification:", notifyErr);
      // Continue even if notification fails
    }
    
    res.status(200).json({ message: "Attendance rejected" });
    
  } catch (err) {
    console.error("Error rejecting attendance:", err);
    res.status(500).json({ message: "Error rejecting attendance" });
  }
};