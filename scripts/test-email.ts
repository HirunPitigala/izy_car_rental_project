
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load env from .env.local (Next.js default for local secrets)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("Checking email configuration...");
console.log("Keys found in env:", Object.keys(process.env).filter(k => k.startsWith("EMAIL") || k.includes("DB") || k.includes("NEXT")));
console.log("EMAIL_USER present:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS present:", !!process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Missing email credentials in .env.local");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function verify() {
    try {
        console.log("Verifying transporter connection...");
        await transporter.verify();
        console.log("✅ Transporter connection verified.");

        console.log("Sending test email...");
        await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email",
            text: "This is a test email.",
        });
        console.log("✅ Test email sent successfully.");
    } catch (error) {
        console.error("❌ Email verification failed:", error);
    }
}

verify();
