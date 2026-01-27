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

export async function sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    console.log(`Attempting to send password reset email to: ${email}`);

    try {
        await transporter.sendMail({
            from: `"IZY Car Rental" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password - IZY Car Rental",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
                        .button { display: inline-block; background: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                        .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password for your IZY Car Rental account. Click the button below to create a new password:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px;">
                                ${resetUrl}
                            </p>
                            
                            <div class="warning">
                                <strong>⏰ This link will expire in 1 hour</strong> for security reasons.
                            </div>
                            
                            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} IZY Car Rental. All rights reserved.</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log("Password reset email sent successfully!");
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

