const { MongoClient } = require("mongodb");

const getSelectionData = (studentData) => {
  const data = { elective1, elective2 };
  for (let student of studentData) {
    if (
      student.elective_selections.first.option1_1 !== "" &&
      !data.elective1[student.elective_selections.first.option1_1]
    ) {
      data.elective1[student.elective_selections.first.option1_1] = 1;
    } else if (data.elective1[student.elective_selections.first.option1_1]) {
      data.elective1[student.elective_selections.first.option1_1] += 1;
    }

    if (
      student.elective_selections.first.option1_2 !== "" &&
      !data.elective1[student.elective_selections.first.option1_2]
    ) {
      data.elective1[student.elective_selections.first.option1_2] = 1;
    } else if (data.elective1[student.elective_selections.first.option1_2]) {
      data.elective1[student.elective_selections.first.option1_2] += 1;
    }

    if (
      student.elective_selections.first.option1_3 !== "" &&
      !data.elective1[student.elective_selections.first.option1_3]
    ) {
      data.elective1[student.elective_selections.first.option1_3] = 1;
    } else if (data.elective1[student.elective_selections.first.option1_3]) {
      data.elective1[student.elective_selections.first.option1_3] += 1;
    }

    if (
      student.elective_selections.first.option1_4 !== "" &&
      !data.elective1[student.elective_selections.first.option1_4]
    ) {
      data.elective1[student.elective_selections.first.option1_4] = 1;
    } else if (data.elective1[student.elective_selections.first.option1_4]) {
      data.elective1[student.elective_selections.first.option1_4] += 1;
    }

    if (
      student.elective_selections.second.option2_1 !== "" &&
      !data.elective2[student.elective_selections.second.option2_1]
    ) {
      data.elective2[student.elective_selections.second.option2_1] = 1;
    } else if (data.elective2[student.elective_selections.second.option2_1]) {
      data.elective2[student.elective_selections.second.option2_1] += 1;
    }

    if (
      student.elective_selections.second.option2_2 !== "" &&
      !data.elective2[student.elective_selections.second.option2_2]
    ) {
      data.elective2[student.elective_selections.second.option2_2] = 1;
    } else if (data.elective2[student.elective_selections.second.option2_2]) {
      data.elective2[student.elective_selections.second.option2_2] += 1;
    }

    if (
      student.elective_selections.second.option2_3 !== "" &&
      !data.elective2[student.elective_selections.second.option2_3]
    ) {
      data.elective2[student.elective_selections.second.option2_3] = 1;
    } else if (data.elective2[student.elective_selections.second.option2_3]) {
      data.elective2[student.elective_selections.second.option2_3] += 1;
    }

    if (
      student.elective_selections.second.option2_4 !== "" &&
      !data.elective2[student.elective_selections.second.option2_4]
    ) {
      data.elective2[student.elective_selections.second.option2_4] = 1;
    } else if (data.elective2[student.elective_selections.second.option2_4]) {
      data.elective2[student.elective_selections.second.option2_4] += 1;
    }
  }
  return data;
};

const getOptimizedSeats =  (data) => {
  const _5thSemStudents = data.filter((student) => student.current_sem === 5);
  const _7thSemStudents = data.filter((student) => student.current_sem === 7);
  //Optimized seats for elective1 and elective 2 5th sem
};

module.exports = getOptimizedSeats;
