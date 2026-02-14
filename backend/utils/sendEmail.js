const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: [options.email],
            subject: options.subject,
            html: options.message
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = sendEmail;
