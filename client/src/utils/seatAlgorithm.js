/**
 * Shuffle Array
 */
const shuffleArray = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

/**
 * Group Students By Department
 */
const groupByDepartment = (students) => {
  const groups = {};

  students.forEach((student) => {
    if (!groups[student.department]) {
      groups[student.department] = [];
    }

    groups[student.department].push(student);
  });

  return groups;
};

/**
 * Mix Departments
 * Example:
 * IT1, CSE1, ECE1, IT2, CSE2, ECE2
 */
const mixDepartments = (students) => {
  const groups = groupByDepartment(students);

  const departments = Object.keys(groups);

  departments.forEach((dept) => {
    groups[dept] = shuffleArray(groups[dept]);
  });

  const mixedStudents = [];

  let studentsRemaining = true;

  while (studentsRemaining) {
    studentsRemaining = false;

    departments.forEach((dept) => {
      if (groups[dept].length > 0) {
        mixedStudents.push(groups[dept].shift());
        studentsRemaining = true;
      }
    });
  }

  return mixedStudents;
};

/**
 * Generate Seat Numbers
 * rows = 4, columns = 5
 * A1 A2 A3 A4 A5
 * B1 B2 B3 B4 B5
 */
export const generateSeatNumbers = (
  rows,
  columns
) => {
  const seats = [];

  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(
      65 + r
    );

    for (let c = 1; c <= columns; c++) {
      seats.push(`${rowLetter}${c}`);
    }
  }

  return seats;
};

/**
 * Allocate Seats
 */
export const allocateSeats = (
  students,
  classroom
) => {
  const mixedStudents =
    mixDepartments(students);

  const seatNumbers = generateSeatNumbers(
    classroom.rows,
    classroom.columns
  );

  const allocation = [];

  for (
    let i = 0;
    i < Math.min(
      mixedStudents.length,
      seatNumbers.length
    );
    i++
  ) {
    allocation.push({
      seatNo: seatNumbers[i],
      regNo: mixedStudents[i].regNo,
      name: mixedStudents[i].name,
      department:
        mixedStudents[i].department,
      year: mixedStudents[i].year,
      section:
        mixedStudents[i].section,
    });
  }

  return allocation;
};

/**
 * Multiple Hall Allocation
 */
export const allocateMultipleHalls = (
  students,
  classrooms
) => {
  const allocations = [];

  let studentIndex = 0;

  classrooms.forEach((hall) => {
    const hallCapacity =
      hall.rows * hall.columns;

    const hallStudents = students.slice(
      studentIndex,
      studentIndex + hallCapacity
    );

    const allocatedSeats =
      allocateSeats(
        hallStudents,
        hall
      );

    allocations.push({
      hallId: hall._id,
      hallNo: hall.hallNo,
      totalSeats: hallCapacity,
      allocatedSeats,
    });

    studentIndex += hallCapacity;
  });

  return allocations;
};