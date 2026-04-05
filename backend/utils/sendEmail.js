import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });

    console.log(` Email sent to ${to}`);
  } catch (err) {
    console.error(" Failed to send email:", err);
    throw err; 
  }
};

export default sendEmail;
