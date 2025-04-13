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

authenticate = (req, res, next) => {
  let token = null;
  console.log("authenticate middleware triggered");

  const authHeader = req.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized! No Auth Header" });
  }

  token = authHeader.slice(7); // "Bearer <token>"

  Session.findOne({ where: { token: token } })
    .then((session) => {
      if (!session) {
        return res.status(401).send({ message: "Unauthorized! Invalid Token" });
      }

      if (session.expirationDate < Date.now()) {
        return res.status(401).send({
          message: "Unauthorized! Expired Token, Logout and Login again",
        });
      }

      return User.findOne({ where: { email: session.email } });
    })
    .then(async (user) => {
      if (!user) {
        return res.status(401).send({ message: "Unauthorized! User not found" });
      }

      console.log("Authenticated User:", user.email);

      //Attach user info to req.user
      req.user = {
        id: user.id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role
      };

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
    })
    .catch((err) => {
      console.error("Authentication Error:", err.message);
      res.status(500).send({ message: "Internal Server Error" });
    });


    
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

const auth = {
  authenticate: authenticate,
  isAdmin: isAdmin,

};

module.exports = auth;
