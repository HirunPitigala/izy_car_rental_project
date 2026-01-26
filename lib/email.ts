import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

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
}
