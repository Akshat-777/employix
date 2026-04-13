import axios from 'axios';

const sendEmail = async ({ to, subject, text }) => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("❌ MISSING RESEND_API_KEY: Please set it on Render.");
      throw new Error("Email service is not configured.");
    }

    console.log("📨 Sending email via Resend API...");

    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Employix <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: `
          <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #4f46e5;">Employix Support</h2>
            <p>${text.replace(/\n/g, '<br>')}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">
              This is an automated message. Please do not reply.
            </p>
          </div>
        `,
      },
      {
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully via Resend:", response.data.id);
  } catch (err) {
    console.error("❌ RESEND ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to send email.");
  }
};

export default sendEmail;
