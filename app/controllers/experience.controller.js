const db = require("../models"); // Import models
const Experience = db.Experience; // Get Experiences model
const Op = db.Sequelize.Op; // Sequelize operators for queries
const notificationController = require("./notification.controller.js");
const Student = db.Student;
const StudentExperience = db.StudentExperience;
const StudentBadge = db.StudentBadge;
const Badge = db.Badge;


// **1. Create a new Experience**
exports.create = (req, res) => {
  if (!req.body.name || !req.body.category || !req.body.description || !req.body.type) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  const experience = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    type: req.body.type,
    badge: req.body.badge,
    major: req.body.major,
    cliftonStrength: req.body.cliftonStrength,
    reflectionRequired: req.body.reflectionRequired || false,
    points: req.body.points || 0,
    status: "Incomplete",
  };

  Experience.create(experience)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while creating the Experience." })
    );
};

// **2. Retrieve all Experiences**
exports.findAll = (req, res) => {
  Experience.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving Experiences." })
    );
};

// **3. Retrieve an Experience by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  Experience.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find Experience with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving Experience with id=" + id })
    );
};

// **4. Update an Experience**
exports.update = (req, res) => {
  const id = req.params.id;

  Experience.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Experience was updated successfully." });
      else res.send({ message: `Cannot update Experience with id=${id}. Maybe Experience was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating Experience with id=" + id })
    );
};

// **5. Delete an Experience**
exports.delete = (req, res) => {
  const id = req.params.id;

  Experience.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Experience was deleted successfully!" });
      else res.send({ message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete Experience with id=" + id })
    );
};

// **6. Delete all Experiences**
exports.deleteAll = (req, res) => {
  Experience.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} Experiences were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all Experiences." })
    );
};


// **7. Student Marks Experience as Complete**
exports.markAsComplete = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Update experience status
    experience.status = "Pending";
    await experience.save();

    // Create StudentExperience entry
    await StudentExperience.create({
      studentId: req.user.id,
      experienceId: experience.id,
      status: 'pending',
      pointsEarned: 0
    });


    // Fetch all admins
    const admins = await db.Admin.findAll();

    // Send notification to each admin
    for (const admin of admins) {
      await notificationController.sendNotification(
         //console.log("📬 Creating notification:", notificationData),
        admin.id,
        `Experience "${experience.name}" needs approval.`,
        "experience_approval",
        { experienceId: experience.id }
      );
    }

    res.json({ message: "Experience marked as Pending", experience });
  } catch (error) {
    console.error("Error marking experience complete:", error);
    res.status(500).json({ message: "Error updating experience", error });
  }
};


// **8. Approve Experience (Admin Action)**
exports.approveExperience = async (req, res) => {
  try {
    // 1. Find the experience
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    // 2. Approve the experience itself
    experience.status = 'Approved';
    experience.approvedBy = req.body.approvedBy || 'Admin';
    experience.completionDate = new Date();
    await experience.save();

    // 3. Find the studentexperience record to get studentId
    const studentExperience = await StudentExperience.findOne({
      where: {
        experienceId: experience.id,
        status: { [Op.not]: 'completed' } // or 'pending', depending on your app flow
      }
    });

    if (!studentExperience) {
      return res.status(404).json({ message: 'No matching student-experience record found.' });
    }

    const studentId = studentExperience.studentId;

    // 4. Mark the student experience as completed and award points
    studentExperience.status = 'completed';
    studentExperience.pointsEarned = experience.points;
    studentExperience.completionDate = new Date();
    await studentExperience.save();

    // 5. Sum total points earned by this student
    const totalPoints = await StudentExperience.sum('pointsEarned', {
      where: {
        studentId,
        status: 'completed'
      }
    });

    // 6. Get all badges linked to this experience
    const relatedBadges = await experience.getBadges();

    for (const badge of relatedBadges) {
      // Get required experiences for the badge
      const requiredExperiences = await badge.getExperiences();
      const requiredIds = requiredExperiences.map(e => e.id);

      // Find which of those the student has completed
      const completed = await StudentExperience.findAll({
        where: {
          studentId,
          experienceId: { [Op.in]: requiredIds },
          status: 'completed'
        }
      });

      // If student completed all required experiences, award badge
      const alreadyEarned = await StudentBadge.findOne({
        where: { studentId, badgeId: badge.id }
      });

      if (completed.length === requiredIds.length && !alreadyEarned) {
        await StudentBadge.create({ studentId, badgeId: badge.id });
        console.log(` Badge awarded: ${badge.name}`);
      }
    }

    res.json({
      message: 'Experience approved, points awarded, and badge check completed.',
      experience
    });

  } catch (error) {
    console.error('Error approving experience:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// **9. Reject Experience (Admin Action)**
exports.rejectExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    experience.status = "Rejected";
    await experience.save();

    res.json({ message: "Experience rejected successfully", experience });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting experience", error });
  }
};
