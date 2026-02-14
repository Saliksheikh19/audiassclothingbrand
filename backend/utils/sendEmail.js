const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    // Looking to send emails in production? check out our Email Service: 
    // https://ethereal.email/ for testing or use Gmail, SendGrid, etc.

    // For Gmail, enable 'App Passwords' in your Google Account security settings.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use 'host' and 'port' from env if not Gmail
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
