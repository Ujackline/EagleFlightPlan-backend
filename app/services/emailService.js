const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another email provider
    auth: {
        user: 'diellatetero@gmail.com',
        pass: 'olas vwfl eaqu kvxe', // Use environment variables for security
    },
});

async function sendAccommodationEmail(studentEmail) {
    const mailOptions = {
        from: 'diellatetero@gmail.com',
        to: 'diella.mwambutsa@eagles.oc.edu',
        subject: 'Instructions for Accommodations',
        text: 'Dear Admin, \n\nA student has submitted a request the is waiting to be viewed.',
        
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendAccommodationEmail;
