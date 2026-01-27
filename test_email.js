const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function testEmail() {
    console.log('Testing email transporter...');
    try {
        await transporter.verify();
        console.log('Transporter is ready!');

        const info = await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: "Test Email",
            text: "This is a test email from the car rental system.",
        });
        console.log('Test email sent:', info.messageId);
    } catch (error) {
        console.error('Email test failed:', error);
    }
}

testEmail();
