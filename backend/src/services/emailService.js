import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

const sendEmail = async ({ to, subject, body }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Normalize formData to a plain object (support both plain objects and Node/FormData-like objects)
    const dataObj = {};
    
    const html = `
      <h2>${subject}</h2>
      <p>Dear ${to},</p>
      <p>${body}</p>
      <p>Best regards,<br>Srijansil Run Team</p>
    `;

    // Send email with PDF attachment
    await transporter.sendMail({
      from: `"Srijansil Run" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to", to);
    return true;
  } catch (err) {
    console.error("Error sending email:", err.message);
    return false;
  }
};

export default sendEmail;
