const db = require("../models");
const Session = db.Session;
const User = db.User;

const authenticate = async (req, res, next) => {
  try {
    let token = null;
    console.log("Authenticating...");

    // Extract token from Authorization header
    let authHeader = req.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      return res.status(401).json({ message: "Unauthorized! No Auth Header" });
    }

    // Check session in the database (Old logic)
    const session = await Session.findOne({ where: { token } });

    if (!session) {
      return res.status(401).json({ message: "Session not found! Please log in again." });
    }

    // Check if session is expired
    if (session.expirationDate < Date.now()) {
      return res.status(401).json({ message: "Unauthorized! Expired Token, Logout and Login again" });
    }

    // Attach user details to request
    req.user = session.id; // Assuming session table has a `userId`
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied! No user found." });
    }

    // Fetch user from database
    const user = await User.findOne({ where: { id: req.user } });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied! Admins only." });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  authenticate,
  isAdmin,
};
