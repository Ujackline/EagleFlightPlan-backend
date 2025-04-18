// const db = require("../models");
// const Session = db.Session;
// const User = db.User;
// const Admin = db.Admin; //  Import Admin model

// authenticate = (req, res, next) => {
//   let token = null;
//   console.log("authenticate middleware triggered");

//   const authHeader = req.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).send({ message: "Unauthorized! No Auth Header" });
//   }

//   token = authHeader.slice(7); // "Bearer <token>"

//   Session.findOne({ where: { token: token } })
//     .then((session) => {
//       if (!session) {
//         return res.status(401).send({ message: "Unauthorized! Invalid Token" });
//       }

//       if (session.expirationDate < Date.now()) {
//         return res.status(401).send({
//           message: "Unauthorized! Expired Token, Logout and Login again",
//         });
//       }

//       return User.findOne({ where: { email: session.email } });
//     })
//     .then(async (user) => {
//       if (!user) {
//         return res.status(401).send({ message: "Unauthorized! User not found" });
//       }

//       console.log("Authenticated User:", user.email);

//       //Attach user info to req.user
//       req.user = {
//         id: user.id,
//         fName: user.fName,
//         lName: user.lName,
//         email: user.email,
//         role: user.role
//       };

//       // If user is an admin, ensure they're also in the admins table
//       if (user.role === "admin") {
//         const existingAdmin = await Admin.findOne({ where: { id: user.id } });

//         if (!existingAdmin) {
//           console.log(`🔹 Admin not found in DB, adding: ${user.email}`);

//           await Admin.create({
//             id: user.id,
//             fName: user.fName,
//             lName: user.lName,
//             email: user.email,
//             role: "admin"
//           });

//           console.log(`Admin inserted into admins table: ${user.email}`);
//         }
//       }

//       next(); // Proceed to next middleware/controller
//     })
//     .catch((err) => {
//       console.error("Authentication Error:", err.message);
//       res.status(500).send({ message: "Internal Server Error" });
//     });


    
// };

// const auth = {
//   authenticate: authenticate,
// };

// module.exports = auth;

const db = require("../models");
const Session = db.Session;
const User = db.User;
const Admin = db.Admin; //  Import Admin model

authenticate = async (req, res, next) => {
  try {
    console.log("authenticate middleware triggered");
    
    const authHeader = req.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Unauthorized! No Auth Header" });
    }
    
    const token = authHeader.slice(7); // "Bearer <token>"
    console.log("Token received:", token.substring(0, 20) + "..."); // Log part of the token for debugging
    
    // Find the session with this token
    const session = await Session.findOne({ where: { token: token } });
    
    if (!session) {
      return res.status(401).send({ message: "Unauthorized! Invalid Token" });
    }
    
    if (session.expirationDate < Date.now()) {
      return res.status(401).send({
        message: "Unauthorized! Expired Token, Logout and Login again",
      });
    }
    
    // Find the user associated with this session
    const user = await User.findOne({ where: { email: session.email } });
    
    if (!user) {
      return res.status(401).send({ message: "Unauthorized! User not found" });
    }
    
    console.log("Authenticated User:", user.email);
    
    // Attach user info to req.user
    req.user = {
      id: user.id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      role: user.role
    };
    
    // Store userId for isAdmin middleware
    req.userId = user.id;
    
    // If user is an admin, ensure they're also in the admins table
    if (user.role === "admin") {
      const existingAdmin = await Admin.findOne({ where: { id: user.id } });
      
      if (!existingAdmin) {
        console.log(`🔹 Admin not found in DB, adding: ${user.email}`);
        
        await Admin.create({
          id: user.id,
          fName: user.fName,
          lName: user.lName,
          email: user.email,
          role: "admin"
        });
        
        console.log(`Admin inserted into admins table: ${user.email}`);
      }
    }
    
    next(); // Proceed to next middleware/controller
  } catch (err) {
    console.error("Authentication Error:", err.message);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// Add the isAdmin middleware
isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).send({ message: "No user identified!" });
    }
    
    // Check if the user has admin role directly from the req.user object
    if (req.user.role === "admin") {
      console.log(`Admin access granted for: ${req.user.email}`);
      next();
      return;
    }
    
    // Double-check in the database
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    
    if (user.role === "admin") {
      console.log(`Admin access granted after DB check for: ${user.email}`);
      next();
      return;
    }
    
    return res.status(403).send({ message: "Admin role required!" });
  } catch (err) {
    console.error("isAdmin Error:", err.message);
    return res.status(500).send({ message: "Error checking admin status" });
  }
};

// Export both middleware functions
const auth = {
  authenticate: authenticate,
  isAdmin: isAdmin

};

module.exports = auth;