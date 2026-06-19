const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSeatAllocationEmail = async (
  studentEmail,
  studentName,
  examName,
  hallNo,
  seatNo
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: "Exam Seat Allocation",
      html: `
        <h2>Exam Seat Allocation Details</h2>
        <p>Hello ${studentName},</p>
        <p>Your seat allocation has been generated.</p>

        <table border="1" cellpadding="8">
          <tr>
            <th>Exam</th>
            <td>${examName}</td>
          </tr>
          <tr>
            <th>Hall</th>
            <td>${hallNo}</td>
          </tr>
          <tr>
            <th>Seat No</th>
            <td>${seatNo}</td>
          </tr>
        </table>

        <br/>
        <p>Best of Luck!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  sendSeatAllocationEmail,
};