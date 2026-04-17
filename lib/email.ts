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

interface VehicleDetails {
    brand: string;
    model: string;
    plateNumber?: string;
    transmission?: string;
    fuelType?: string;
    seatingCapacity?: number;
    image?: string;
}

interface BookingDetails {
    rentalDate?: Date | string;
    returnDate?: Date | string;
    pickupLocation?: string;
    dropoffLocation?: string;
    passengers?: number;
    totalFare?: string | number;
    pickupTime?: string;
    message?: string;
}

export async function sendBookingStatusEmail(
    email: string,
    customerName: string,
    bookingId: number,
    serviceType: string,
    status: "ACCEPTED" | "REJECTED",
    rejectionReason?: string,
    vehicle?: VehicleDetails,
    details?: BookingDetails
) {
    const isAccepted = status === "ACCEPTED";
    const subject = isAccepted
        ? `Your ${serviceType} Booking #${bookingId} Has Been Approved — IZY Car Rental`
        : `Your ${serviceType} Booking #${bookingId} Has Been Declined — IZY Car Rental`;

    const accentColor = isAccepted ? "#16a34a" : "#dc2626";
    const headerBg = isAccepted
        ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
        : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
    
    const statusLabel = isAccepted ? "APPROVED" : "DECLINED";

    const formatDate = (date?: Date | string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const rejectionBlock = !isAccepted && rejectionReason
        ? `<div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;margin:24px 0;border-radius:8px;">
               <strong style="color:#b91c1c;display:block;margin-bottom:4px;">Reason for Decline:</strong>
               <p style="margin:0;color:#374151;font-size:15px;">${rejectionReason}</p>
           </div>`
        : "";

    const nextStepsBlock = isAccepted
        ? `<div style="margin-top:24px;padding:20px;background:#f0fdf4;border-radius:12px;color:#166534;">
                <h3 style="margin:0 0 8px 0;font-size:16px;">Next Steps</h3>
                <p style="margin:0;font-size:14px;line-height:1.5;">Our team will be in touch shortly with further details. You can now log in to your account to view your full booking information and prepare for your trip.</p>
           </div>`
        : `<p style="margin-top:24px;color:#6b7280;font-size:14px;">If you believe this was a mistake or would like to make a new booking, please visit our website or contact our support team at support@izycar.com.</p>`;

    let specsHtml = "";
    if (vehicle) {
        specsHtml = `
            <div style="margin:24px 0;padding:24px;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;">
                <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Vehicle Specifications</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div style="margin-bottom:12px;">
                        <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Vehicle</span>
                        <span style="font-size:14px;font-weight:600;color:#1e293b;">${vehicle.brand} ${vehicle.model}</span>
                    </div>
                    ${vehicle.plateNumber ? `
                    <div style="margin-bottom:12px;">
                        <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Plate Number</span>
                        <span style="font-size:14px;font-weight:600;color:#1e293b;">${vehicle.plateNumber}</span>
                    </div>` : ""}
                    ${vehicle.transmission ? `
                    <div style="margin-bottom:12px;">
                        <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Transmission</span>
                        <span style="font-size:14px;font-weight:600;color:#1e293b;">${vehicle.transmission}</span>
                    </div>` : ""}
                    ${vehicle.fuelType ? `
                    <div style="margin-bottom:12px;">
                        <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Fuel Type</span>
                        <span style="font-size:14px;font-weight:600;color:#1e293b;">${vehicle.fuelType}</span>
                    </div>` : ""}
                </div>
            </div>
        `;
    }

    let summaryHtml = "";
    if (details) {
        summaryHtml = `
            <div style="margin:24px 0;">
                <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Booking Summary</h3>
                <table style="width:100%;border-collapse:collapse;">
                    ${details.rentalDate ? `
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;">Pickup Date</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${formatDate(details.rentalDate)} ${details.pickupTime || ""}</td>
                    </tr>` : ""}
                    ${details.returnDate ? `
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;">Return Date</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${formatDate(details.returnDate)}</td>
                    </tr>` : ""}
                    ${details.pickupLocation ? `
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;">Pickup Location</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${details.pickupLocation}</td>
                    </tr>` : ""}
                    ${details.dropoffLocation ? `
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;">Dropoff Location</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${details.dropoffLocation}</td>
                    </tr>` : ""}
                    ${details.totalFare ? `
                    <tr>
                        <td style="padding:16px 0 0 0;color:#1e293b;font-size:16px;font-weight:700;">Total Amount</td>
                        <td style="padding:16px 0 0 0;color:${accentColor};font-size:20px;font-weight:800;text-align:right;">LKR ${Number(details.totalFare).toLocaleString()}</td>
                    </tr>` : ""}
                </table>
            </div>
        `;
    }

    try {
        await transporter.sendMail({
            from: `"IZY Car Rental" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; }
                    .wrapper { background-color: #f1f5f9; padding: 40px 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                    .header { background: ${headerBg}; color: white; padding: 48px 40px; text-align: center; }
                    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 16px; }
                    .content { padding: 40px; }
                    .footer { text-align: center; padding: 32px; color: #94a3b8; font-size: 13px; }
                    .h1 { margin: 0; font-size: 28px; font-weight: 800; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="header">
                            <div class="badge">${statusLabel}</div>
                            <h1 class="h1">Booking Update</h1>
                            <p style="margin:8px 0 0 0;opacity:0.8;font-size:16px;">Reservation #${bookingId}</p>
                        </div>
                        <div class="content">
                            <p>Dear ${customerName},</p>
                            <p>We are writing to inform you that your <strong>${serviceType}</strong> booking has been <strong>${statusLabel.toLowerCase()}</strong>.</p>
                            
                            ${rejectionBlock}
                            ${specsHtml}
                            ${summaryHtml}
                            ${nextStepsBlock}
                            
                            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f1f5f9;">
                                <p style="margin:0;font-size:14px;color:#64748b;">Best regards,<br><strong style="color:#1e293b;">The IZY Car Rental Team</strong></p>
                            </div>
                        </div>
                        <div class="footer">
                            <p style="margin:0 0 8px 0;">© ${new Date().getFullYear()} IZY Car Rental. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`,
        });
        console.log(`Enhanced booking status email sent to ${email} for booking #${bookingId}`);
    } catch (error) {
        console.error(`Error sending booking status email for booking #${bookingId}:`, error);
    }
}

