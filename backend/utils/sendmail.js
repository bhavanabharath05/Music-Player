import nodemailer from "nodemailer";

// ✅ FIX: Changed function signature to accept an options object
const sendMail = async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    await transporter.sendMail({
        from: "hello@musicapp.com",
        to,
        subject,
        text: text || "", // Optional text fallback
        html: html || text, // Use HTML if provided, otherwise fall back to text
    });
};

export default sendMail;