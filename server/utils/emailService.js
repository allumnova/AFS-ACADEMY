const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For development, we can use Ethereal Email which is a fake SMTP service
    // Or simply log the email if no credentials are provided

    // Use environment variables for real SMTP in production
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: options.email,
        replyTo: `"${process.env.REPLY_TO_NAME}" <${process.env.REPLY_TO_EMAIL}>`,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
};

module.exports = sendEmail;
