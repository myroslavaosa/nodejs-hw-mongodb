// src/utils/sendMail.js
import nodemailer from "nodemailer";
import { SMTP } from "../constants/index.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    secure: Number(getEnvVar(SMTP.SMTP_PORT)) === 465, // true для 465, false для 587
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
    tls: {
        rejectUnauthorized: true,
    },
});

// 🔍 Перевіримо підключення при старті
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP connection error:", error);
    } else {
        console.log("✅ SMTP server is ready:", success);
    }
});

export const sendEmail = async (options) => {
    console.log("📧 Sending email with options:", options);

    try {
        const info = await transporter.sendMail(options);
        console.log("✅ Email sent:", info);
        return info;
    } catch (err) {
        console.error("❌ Email send error:", err);
        throw err;
    }
};
