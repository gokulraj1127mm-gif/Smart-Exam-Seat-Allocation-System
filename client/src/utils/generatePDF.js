import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generate Hall Seating Report PDF
 */
export const generateHallReportPDF = (
  examName,
  hallName,
  students
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Hall Seating Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Exam: ${examName}`, 14, 30);
  doc.text(`Hall: ${hallName}`, 14, 38);

  const tableData = students.map((student) => [
    student.seatNo,
    student.regNo,
    student.name,
    student.department,
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Seat No", "Register No", "Name", "Department"]],
    body: tableData,
  });

  doc.save(`${hallName}-Seating-Report.pdf`);
};

/**
 * Generate Student Report PDF
 */
export const generateStudentReportPDF = (
  student
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Student Seat Allocation Report", 14, 20);

  doc.setFontSize(12);

  doc.text(
    `Register No: ${student.regNo}`,
    14,
    40
  );

  doc.text(
    `Name: ${student.name}`,
    14,
    50
  );

  doc.text(
    `Department: ${student.department}`,
    14,
    60
  );

  doc.text(
    `Seat Number: ${student.seatNo}`,
    14,
    70
  );

  doc.text(
    `Hall: ${student.hall}`,
    14,
    80
  );

  doc.save(
    `${student.regNo}-Seat-Report.pdf`
  );
};

/**
 * Generate Attendance Sheet PDF
 */
export const generateAttendancePDF = (
  examName,
  hallName,
  students
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Attendance Sheet", 14, 20);

  doc.setFontSize(12);
  doc.text(`Exam: ${examName}`, 14, 30);
  doc.text(`Hall: ${hallName}`, 14, 38);

  const tableData = students.map((student) => [
    student.seatNo,
    student.regNo,
    student.name,
    "",
  ]);

  autoTable(doc, {
    startY: 50,
    head: [
      [
        "Seat No",
        "Register No",
        "Student Name",
        "Signature",
      ],
    ],
    body: tableData,
  });

  doc.save(`${hallName}-Attendance.pdf`);
};

/**
 * Generate Complete Exam Report PDF
 */
export const generateExamReportPDF = (
  exam
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Exam Allocation Report", 14, 20);

  doc.setFontSize(12);

  doc.text(
    `Exam Name: ${exam.examName}`,
    14,
    40
  );

  doc.text(
    `Department: ${exam.department}`,
    14,
    50
  );

  doc.text(
    `Date: ${exam.date}`,
    14,
    60
  );

  doc.text(
    `Session: ${exam.session}`,
    14,
    70
  );

  doc.text(
    `Total Students: ${exam.totalStudents}`,
    14,
    80
  );

  doc.text(
    `Allocated Halls: ${exam.totalHalls}`,
    14,
    90
  );

  doc.save(
    `${exam.examName}-Exam-Report.pdf`
  );
};