// const express = require('express');
// const sendAccommodationEmail = require('../services/emailService');

// const router = express.Router();

// router.post('/request', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }

//     const result = await sendAccommodationEmail(email);
//     res.status(result.success ? 200 : 500).json({ message: result.message });
// });

// // Register the route directly in `app`
// const app = require('express')();

// app.use("/flight-plan-t9", router);

// module.exports = app;

const express = require('express');
const sendAccommodationEmail = require('../services/emailService');

const router = express.Router();

router.post('/request', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const result = await sendAccommodationEmail(req.body) || { success: false, message: "Email function failed" };
    res.status(result.success ? 200 : 500).json({ message: result.message });
    
    // const result = await sendAccommodationEmail(email);
    // res.status(result.success ? 200 : 500).json({ message: result.message });
});

module.exports = router;
