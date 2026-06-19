const generateSeatNumbers = (
  rows,
  columns
) => {
  const seats = [];

  for (let i = 0; i < rows; i++) {
    const rowLetter =
      String.fromCharCode(65 + i);

    for (
      let j = 1;
      j <= columns;
      j++
    ) {
      seats.push(
        `${rowLetter}${j}`
      );
    }
  }

  return seats;
};

const shuffleArray = (array) => {
  const arr = [...array];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] = [
      arr[j],
      arr[i],
    ];
  }

  return arr;
};

const allocateSeats = (
  students,
  classroom
) => {
  const shuffledStudents =
    shuffleArray(students);

  const seatNumbers =
    generateSeatNumbers(
      classroom.rows,
      classroom.columns
    );

  const allocations = [];

  for (
    let i = 0;
    i <
    Math.min(
      shuffledStudents.length,
      seatNumbers.length
    );
    i++
  ) {
    allocations.push({
      seatNo: seatNumbers[i],
      studentId:
        shuffledStudents[i]._id,
      regNo:
        shuffledStudents[i].regNo,
      name:
        shuffledStudents[i].name,
      department:
        shuffledStudents[i]
          .department,
      hallNo: classroom.hallNo,
    });
  }

  return allocations;
};

const allocateMultipleHalls = (
  students,
  classrooms
) => {
  const result = [];

  let currentStudent = 0;

  classrooms.forEach((hall) => {
    const capacity =
      hall.rows * hall.columns;

    const hallStudents =
      students.slice(
        currentStudent,
        currentStudent +
          capacity
      );

    const allocations =
      allocateSeats(
        hallStudents,
        hall
      );

    result.push({
      hallId: hall._id,
      hallNo: hall.hallNo,
      allocations,
    });

    currentStudent += capacity;
  });

  return result;
};

module.exports = {
  allocateSeats,
  allocateMultipleHalls,
};