const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateSeatReport = (
  allocations,
  filePath
) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      doc.pipe(
        fs.createWriteStream(filePath)
      );

      doc
        .fontSize(20)
        .text(
          "Seat Allocation Report",
          {
            align: "center",
          }
        );

      doc.moveDown();

      allocations.forEach(
        (allocation) => {
          doc
            .fontSize(12)
            .text(
              `Seat: ${allocation.seatNo}`
            );

          doc.text(
            `Student: ${allocation.name}`
          );

          doc.text(
            `Register No: ${allocation.regNo}`
          );

          doc.text(
            `Department: ${allocation.department}`
          );

          doc.text(
            `Hall: ${allocation.hallNo}`
          );

          doc.moveDown();
        }
      );

      doc.end();

      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateSeatReport,
};