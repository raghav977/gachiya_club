import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

/**
 * Format BIB number as 4-digit padded string
 * e.g., 1 -> "0001", 10 -> "0010"
 */
const formatBibNumber = (bibNumber) => {
  if (bibNumber === null || bibNumber === undefined || bibNumber === "") {
    return "N/A";
  }
  const num = Number(bibNumber);
  if (isNaN(num)) return "N/A";
  return String(num).padStart(4, "0");
};

/**
 * Send verification email with BIB number to player
 */
export const sendVerificationEmail = async ({
  to,
  playerName,
  bibNumber,
  eventTitle,
  categoryTitle,
  eventDate,
}) => {
  try {
    // Format BIB as 4-digit
    const formattedBib = formatBibNumber(bibNumber);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format event date
    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "TBA";

    // Generate PDF with BIB details
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


    doc.fontSize(22).font("Helvetica-Bold").fillColor("#1a365d")
      .text("🎉 Registration Verified!", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(16).font("Helvetica").fillColor("#2d3748")
      .text("Srijansil Run", { align: "center" });
    doc.moveDown(1.5);

    // BIB Number Box
    doc.fontSize(14).font("Helvetica-Bold").fillColor("#1a365d")
      .text("Your BIB Number", { align: "center" });
    doc.moveDown(0.3);
    
    doc.fontSize(48).font("Helvetica-Bold").fillColor("#e53e3e")
      .text(formattedBib, { align: "center" });
    doc.moveDown(1);

    // Details
    doc.fontSize(12).fillColor("#2d3748");
    doc.font("Helvetica-Bold").text("Participant: ", { continued: true });
    doc.font("Helvetica").text(playerName);
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Event: ", { continued: true });
    doc.font("Helvetica").text(eventTitle);
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Category: ", { continued: true });
    doc.font("Helvetica").text(categoryTitle);
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Date: ", { continued: true });
    doc.font("Helvetica").text(formattedDate);
    doc.moveDown(1.5);

    // Instructions
    doc.fontSize(11).fillColor("#4a5568")
      .text("Important Instructions:", { underline: true });
    doc.moveDown(0.3);
    doc.font("Helvetica")
      .text("• Please bring this document or show the email on your phone at registration.")
      .text("• Arrive at least 30 minutes before the event starts.")
      .text("• Your BIB number will be used for timing and identification.")
      .text("• Make sure to wear your BIB visibly on your front.");
    doc.moveDown(1);

    doc.fontSize(10).fillColor("gray")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });

    doc.end();
    const pdfBuffer = await pdfPromise;

    // HTML Email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .bib-box { background: white; border: 3px solid #e53e3e; border-radius: 15px; padding: 20px; text-align: center; margin: 20px 0; }
          .bib-number { font-size: 48px; font-weight: bold; color: #e53e3e; }
          .details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #4a5568; }
          .footer { text-align: center; color: #718096; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your registration has been verified</p>
          </div>
          <div class="content">
            <p>Dear <strong>${playerName}</strong>,</p>
            <p>Great news! Your registration for <strong>${eventTitle}</strong> has been verified and approved.</p>
            
            <div class="bib-box">
              <p style="margin: 0; color: #4a5568;">Your BIB Number</p>
              <div class="bib-number">${formattedBib}</div>
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Event:</span> ${eventTitle}
              </div>
              <div class="detail-row">
                <span class="detail-label">Category:</span> ${categoryTitle}
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span> ${formattedDate}
              </div>
            </div>

            <h3>📋 Important Instructions:</h3>
            <ul>
              <li>Please bring this email or the attached PDF on event day</li>
              <li>Arrive at least 30 minutes before the event starts</li>
              <li>Your BIB number will be used for timing and identification</li>
              <li>Wear your BIB visibly on your front during the event</li>
            </ul>

            <p>We look forward to seeing you at the event!</p>
            <p>Best regards,<br><strong>Srijansil Run Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Srijansil Run" <${process.env.SMTP_USER}>`,
      to,
      subject: `✅ Registration Verified - BIB #${formattedBib} | ${eventTitle}`,
      html,
      attachments: [
        {
          filename: `BIB_${formattedBib}_${playerName.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`Verification email sent to ${to} with BIB #${formattedBib}`);
    return true;
  } catch (err) {
    console.error("Error sending verification email:", err.message);
    throw err;
  }
};

export default sendVerificationEmail;
