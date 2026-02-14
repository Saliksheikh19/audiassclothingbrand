const nodemailer = require('nodemailer');
const dns = require('dns');
const util = require('util');
const resolve4 = util.promisify(dns.resolve4);

const sendEmail = async (options) => {
    // 1. Resolve IPv4 address explicitly to bypass IPv6 issues on Render
    let smtpHost = 'smtp.gmail.com';
    try {
        const addresses = await resolve4('smtp.gmail.com');
        if (addresses && addresses.length > 0) {
            smtpHost = addresses[0];
            console.log(`Resolved smtp.gmail.com to IPv4: ${smtpHost}`);
        }
    } catch (error) {
        console.error('Failed to resolve IPv4 for smtp.gmail.com, using fallback:', error);
    }

    // 2. Create a transporter using the resolved IP
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 587,
        secure: false, // use STARTTLS
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
            servername: 'smtp.gmail.com' // Essential: Validate cert against the domain, not the IP
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
