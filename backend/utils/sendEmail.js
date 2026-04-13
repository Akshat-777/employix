import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ MISSING SMTP CREDENTIALS: Set SMTP_USER and SMTP_PASS on Render.");
      throw new Error("SMTP credentials are missing.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection configuration before sending
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection Verified");

    await transporter.sendMail({
      from: `"Employix Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ MAIL ERROR:", err.message);
    throw err; 
  }
};

export default sendEmail;
