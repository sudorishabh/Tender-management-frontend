import nodemailer from "nodemailer";

// Create email transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

// Verify connection on startup
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ SMTP configuration is valid");
    return true;
  } catch (error) {
    console.error("❌ SMTP config error:", error);
    return false;
  }
}

// Email options interface
export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Send email function
export async function sendMail({ to, subject, text, html }: EmailOptions) {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    text,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
}
