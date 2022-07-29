const { MongoClient } = require("mongodb");
const json2xls = require("json2xls");
const fs = require("fs");

const electiveAllotment = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = client.db("cse");
  const collection = db.collection("student-data");

  const data = await collection.find().toArray();

  await client.close();

  const _7thSemData = data
    .filter(
      (student) =>
        student.current_sem === 7 && student.cgpa && student.elective_selections
    )
    .sort((studentA, studentB) => studentB.cgpa - studentA.cgpa)
    .map((student) => ({
      REGNO: student.regNo,
      NAME: student.name,
      CGPA: student.cgpa,
      elective_1: student.elective_1,
      elective_2: student.elective_2,
      elective_3: student.elective_3,
      elective_4: student.elective_4,
      elective_5: student.elective_5,
      elective_6: student.elective_6,
      elective_selections: student.elective_selections,
    }));

  return _7thSemData;
};

electiveAllotment()
  .then((data) => {
    // fs.writeFileSync(
    //     `data/PreAllotmentTransformedData7thSem.json`,
    //     JSON.stringify(dat   a, null, 2)
    // );

    const selectionCountsPerSubject = data.reduce(
      (previousValue, currentValue) => {
        const keyElective1 = Object.keys(
          currentValue.elective_selections.first
        );
        for (let key of keyElective1) {
          if (
            !previousValue.elective_1[
              currentValue.elective_selections.first[key]
            ] &&
            currentValue.elective_selections.first[key]
          ) {
            previousValue.elective_1[
              currentValue.elective_selections.first[key]
            ] = 1;
          } else if (
            previousValue.elective_1[
              currentValue.elective_selections.first[key]
            ] &&
            currentValue.elective_selections.first[key] !== ""
          ) {
            previousValue.elective_1[
              currentValue.elective_selections.first[key]
            ] += 1;
          }
        }

        const keyElective2 = Object.keys(
          currentValue.elective_selections.second
        );
        for (let key of keyElective2) {
          if (
            !previousValue.elective_2[
              currentValue.elective_selections.second[key]
            ] &&
            currentValue.elective_selections.second[key]
          ) {
            previousValue.elective_2[
              currentValue.elective_selections.second[key]
            ] = 1;
          } else if (
            previousValue.elective_2[
              currentValue.elective_selections.second[key]
            ] &&
            currentValue.elective_selections.second[key] !== ""
          ) {
            previousValue.elective_2[
              currentValue.elective_selections.second[key]
            ] += 1;
          }
        }

        const keyElective3 = Object.keys(
          currentValue.elective_selections.third
        );
        for (let key of keyElective3) {
          if (
            !previousValue.elective_3[
              currentValue.elective_selections.third[key]
            ] &&
            currentValue.elective_selections.third[key]
          ) {
            previousValue.elective_3[
              currentValue.elective_selections.third[key]
            ] = 1;
          } else if (
            previousValue.elective_3[
              currentValue.elective_selections.third[key]
            ] &&
            currentValue.elective_selections.third[key] !== ""
          ) {
            previousValue.elective_3[
              currentValue.elective_selections.third[key]
            ] += 1;
          }
        }
        return previousValue;
      },
      { elective_1: {}, elective_2: {}, elective_3: {} }
    );

    const keysOfSelectionData = Object.keys(selectionCountsPerSubject);
    const subjectNameElctive1 = Object.keys(
      selectionCountsPerSubject.elective_1
    );
    const subjectNameElctive2 = Object.keys(
      selectionCountsPerSubject.elective_2
    );
    const subjectNameElctive3 = Object.keys(
      selectionCountsPerSubject.elective_3
    );

    let elective_1_total_selections = 0;
    for (let key in selectionCountsPerSubject.elective_1) {
      elective_1_total_selections += selectionCountsPerSubject.elective_1[key];
    }

    let elective_2_total_selections = 0;
    for (let key in selectionCountsPerSubject.elective_2) {
      elective_2_total_selections += selectionCountsPerSubject.elective_2[key];
    }

    let elective_3_total_selections = 0;
    for (let key in selectionCountsPerSubject.elective_3) {
      elective_3_total_selections += selectionCountsPerSubject.elective_3[key];
    }

    const optimizedSeatsElective1 = {};
    for (let key in selectionCountsPerSubject.elective_1) {
      optimizedSeatsElective1[key] = Math.ceil(
        (selectionCountsPerSubject.elective_1[key] /
          elective_1_total_selections) *
          data.length
      );
    };
    const opttimizedSeatsElective1Copy = {...optimizedSeatsElective1};

    const optimizedSeatsElective2 = {};
    for (let key in selectionCountsPerSubject.elective_2) {
      optimizedSeatsElective2[key] = Math.ceil(
        (selectionCountsPerSubject.elective_2[key] /
          elective_2_total_selections) *
          data.length
      );
    }
    const optimizedSeatsElective2Copy = {...optimizedSeatsElective2};

    const optimizedSeatsElective3 = {};
    for (let key in selectionCountsPerSubject.elective_3) {
      optimizedSeatsElective3[key] = Math.ceil(
        (selectionCountsPerSubject.elective_3[key] /
          elective_3_total_selections) *
          data.length
      );
    }

    const optimizedSeatsElective3Copy = {...optimizedSeatsElective3}

    const allotedSeats = data.reduce((previousValue, currentValue) => {
      const studentObj = {
        REGNO: currentValue.REGNO,
        NAME: currentValue.NAME,
        CGPA: currentValue.CGPA,
        first_elective: "",
        second_elective: "",
        third_elective: "",
      };
      for (let key in currentValue.elective_selections.second) {
        if (
          optimizedSeatsElective2[
            currentValue.elective_selections.second[key]
          ] > 0
        ) {
          studentObj.second_elective =
            currentValue.elective_selections.second[key];
          optimizedSeatsElective2[
            currentValue.elective_selections.second[key]
          ] -= 1;
          break;
        }
      }
      for (let key in currentValue.elective_selections.first) {
        if (
          studentObj.second_elective === "CS1659 Ethical Hacking" &&
          currentValue.elective_selections.first[key] ===
            "CS1733 Cryptography & Network Security"
        ) {
          continue;
        }
        if (
          optimizedSeatsElective1[currentValue.elective_selections.first[key]] >
          0
        ) {
          studentObj.first_elective =
            currentValue.elective_selections.first[key];
          optimizedSeatsElective1[
            currentValue.elective_selections.first[key]
          ] -= 1;
          break;
        }
      }

      for (let key in currentValue.elective_selections.third) {
        if (
          optimizedSeatsElective3[currentValue.elective_selections.third[key]] >
          0
        ) {
          studentObj.third_elective =
            currentValue.elective_selections.third[key];
          optimizedSeatsElective3[
            currentValue.elective_selections.third[key]
          ] -= 1;
          break;
        }
      }

      previousValue.push(studentObj);

      return previousValue;
    }, []);
    console.log(opttimizedSeatsElective1Copy)
    const emptyFirstElective = allotedSeats.filter(student => !student.first_elective).length;
    for (let key in opttimizedSeatsElective1Copy) {
        opttimizedSeatsElective1Copy[key] += emptyFirstElective
    }
    console.log(opttimizedSeatsElective1Copy)
    const finalAllotedSeats = data.reduce((previousValue, currentValue) => {
      const studentObj = {
        REGNO: currentValue.REGNO,
        NAME: currentValue.NAME,
        CGPA: currentValue.CGPA,
        first_elective: "",
        second_elective: "",
        third_elective: "",
      };
      for (let key in currentValue.elective_selections.second) {
        if (
          optimizedSeatsElective2Copy[
            currentValue.elective_selections.second[key]
          ] > 0
        ) {
          studentObj.second_elective =
            currentValue.elective_selections.second[key];
          optimizedSeatsElective2Copy[
            currentValue.elective_selections.second[key]
          ] -= 1;
          break;
        }
      }
      for (let key in currentValue.elective_selections.first) {
        if (
          studentObj.second_elective === "CS1659 Ethical Hacking" &&
          currentValue.elective_selections.first[key] ===
            "CS1733 Cryptography & Network Security"
        ) {
          continue;
        }
        if (
          opttimizedSeatsElective1Copy[currentValue.elective_selections.first[key]] >
          0
        ) {
          studentObj.first_elective =
            currentValue.elective_selections.first[key];
          opttimizedSeatsElective1Copy[
            currentValue.elective_selections.first[key]
          ] -= 1;
          break;
        }
      }

      for (let key in currentValue.elective_selections.third) {
        if (
          optimizedSeatsElective3Copy[currentValue.elective_selections.third[key]] >
          0
        ) {
          studentObj.third_elective =
            currentValue.elective_selections.third[key];
          optimizedSeatsElective3Copy[
            currentValue.elective_selections.third[key]
          ] -= 1;
          break;
        }
      }

      previousValue.push(studentObj);

      return previousValue;
    }, []);
    const xlsFile = json2xls(finalAllotedSeats);
    fs.writeFileSync("data/ElectiveAllotment7thSem.xlsx", xlsFile, "binary");
    // const stringifiedData = JSON.stringify(allotedSeats, null, 2);
    // const selectionData = JSON.stringify(data, null, 2)
    // fs.writeFileSync("data/ElectiveSelection7thSem.json", selectionData)
    // fs.writeFileSync("data/ElectiveAllotment7thSem.json", stringifiedData);
  })
  .catch((err) => console.log(err));
