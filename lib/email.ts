import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("Transporter connection error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export async function sendVerificationEmail(email: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    console.log(`Attempting to send verification email to: ${email}`);

    try {
        await transporter.sendMail({
            from: `"Car Rental" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: `
        <h2>Verify Your Account</h2>
        <p>Click this link to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw so the API route can catch it
    }
}
