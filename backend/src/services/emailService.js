import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

const sendEmail = async ({ to, subject, formData }) => {
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
    if (formData && typeof formData === "object") {
      // If it has a `get` method (FormData in some environments), iterate known keys
      if (typeof formData.get === "function" && typeof formData.entries === "function") {
        for (const [k, v] of formData.entries()) {
          dataObj[k] = v;
        }
      } else {
        Object.assign(dataObj, formData);
      }
    }

    // Generate PDF dynamically and wait for completion
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));

    const pdfPromise = new Promise((resolve, reject) => {
      doc.on("end", () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        } catch (err) {
          reject(err);
        }
      });
      doc.on("error", (err) => reject(err));
    });

    // Header
    doc.fontSize(18).font("Helvetica-Bold").text("Srijansil Run Registration Receipt", { align: "center" });
    doc.moveDown(0.5);

    // Meta
    const now = new Date();
    doc.fontSize(10).font("Helvetica").fillColor("gray").text(`Generated: ${now.toLocaleString()}`, { align: "right" });
    doc.moveDown();

    // Body: nicely formatted key/value table
    doc.fontSize(12).fillColor("black");
    const entries = Object.entries(dataObj);
    entries.forEach(([key, value]) => {
      // humanize key (e.g., fullName -> Full Name)
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      const textVal = value === undefined || value === null ? "" : String(value);
      doc.font("Helvetica-Bold").text(`${label}: `, { continued: true, width: 200 });
      doc.font("Helvetica").text(textVal);
      doc.moveDown(0.2);
    });

    doc.moveDown(1);
    doc.fontSize(12).text("Thank you for registering. Please keep this receipt for your records.");

    doc.end();
    const pdfBuffer = await pdfPromise;

    // HTML body for email
    const html = `
      <h2>${subject}</h2>
      <p>Dear ${formData["Full Name"]},</p>
      <p>Thank you for registering! Your details are attached as a receipt.</p>
      <p>Best regards,<br>Srijansil Run Team</p>
    `;

    // Send email with PDF attachment
    await transporter.sendMail({
      from: `"Srijansil Run" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "registration_receipt.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("Email sent to", to);
    return true;
  } catch (err) {
    console.error("Error sending email:", err.message);
    return false;
  }
};

export default sendEmail;
