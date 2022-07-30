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

    const _5thSemData = data
        .filter(
            (student) =>
                student.current_sem === 5 &&
                student.cgpa &&
                student.elective_selections
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
            elective_selections: student.elective_selections,
        }));

    return _5thSemData;
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

                
                return previousValue;
            },
            { elective_1: {}, elective_2: {} }
        );

        const keysOfSelectionData = Object.keys(selectionCountsPerSubject);

        let elective_1_total_selections = 0;
        for (let key in selectionCountsPerSubject.elective_1) {
            elective_1_total_selections +=
                selectionCountsPerSubject.elective_1[key];
        }

        let elective_2_total_selections = 0;
        for (let key in selectionCountsPerSubject.elective_2) {
            elective_2_total_selections +=
                selectionCountsPerSubject.elective_2[key];
        }

        const optimizedSeatsElective1 = {};
        for (let key in selectionCountsPerSubject.elective_1) {
            optimizedSeatsElective1[key] = Math.ceil(
                (selectionCountsPerSubject.elective_1[key] /
                    elective_1_total_selections) *
                    data.length
            );
        }
        const opttimizedSeatsElective1Copy = { ...optimizedSeatsElective1 };

        const optimizedSeatsElective2 = {};
        for (let key in selectionCountsPerSubject.elective_2) {
            optimizedSeatsElective2[key] = Math.ceil(
                (selectionCountsPerSubject.elective_2[key] /
                    elective_2_total_selections) *
                    data.length
            );
        }
        const optimizedSeatsElective2Copy = { ...optimizedSeatsElective2 };

        const allotedSeats = data.reduce((previousValue, currentValue) => {
            const studentObj = {
                REGNO: currentValue.REGNO,
                NAME: currentValue.NAME,
                CGPA: currentValue.CGPA,
                first_elective: "",
                second_elective: "",
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
                    optimizedSeatsElective1[
                        currentValue.elective_selections.first[key]
                    ] > 0
                ) {
                    studentObj.first_elective =
                        currentValue.elective_selections.first[key];
                    optimizedSeatsElective1[
                        currentValue.elective_selections.first[key]
                    ] -= 1;
                    break;
                }
            }

            previousValue.push(studentObj);

            return previousValue;
        }, []);

        const emptyFirstElective = allotedSeats.filter(
            (student) => !student.first_elective
        ).length;

        for (let key in opttimizedSeatsElective1Copy) {
            opttimizedSeatsElective1Copy[key] += emptyFirstElective;
        }

        const finalAllotedSeats = data.reduce((previousValue, currentValue) => {
            const studentObj = {
                REGNO: currentValue.REGNO,
                NAME: currentValue.NAME,
                CGPA: currentValue.CGPA,
                first_elective: "",
                second_elective: "",
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
                    opttimizedSeatsElective1Copy[
                        currentValue.elective_selections.first[key]
                    ] > 0
                ) {
                    studentObj.first_elective =
                        currentValue.elective_selections.first[key];
                    opttimizedSeatsElective1Copy[
                        currentValue.elective_selections.first[key]
                    ] -= 1;
                    break;
                }
            }

            previousValue.push(studentObj);

            return previousValue;
        }, []);

        const xlsFile = json2xls(finalAllotedSeats);
        fs.writeFileSync(
            "data/ElectiveAllotment5thSem.xlsx",
            xlsFile,
            "binary"
        );

        const subjectNameElective1 = Object.keys(
            selectionCountsPerSubject.elective_1
        );
        const subjectNameElective2 = Object.keys(
            selectionCountsPerSubject.elective_2
        );
       
        console.log(
            subjectNameElective1,
            subjectNameElective2,
        );

        const subjectWiseData = {};
        for (let student of finalAllotedSeats) {
            const studentObj = {
                NAME: student.NAME,
                REGNO: student.REGNO,
                CGPA: student.CGPA,
            };
            for (let subject of subjectNameElective1) {
                if (student.first_elective === subject && !subjectWiseData[subject]) {
                    subjectWiseData[subject] = [];
                    subjectWiseData[subject].push(studentObj);
                } else if (student.first_elective === subject && subjectWiseData[subject].length > 0) {
                    subjectWiseData[subject].push(studentObj);
                }
            }

            for (let subject of subjectNameElective2) {
                if (student.second_elective === subject && !subjectWiseData[subject]) {
                    subjectWiseData[subject] = [];
                    subjectWiseData[subject].push(studentObj);
                } else if (student.second_elective === subject && subjectWiseData[subject].length > 0) {
                    subjectWiseData[subject].push(studentObj);
                }
            }
        }
        for (let key in subjectWiseData) {
            const xlsData = json2xls(subjectWiseData[key]);
            fs.writeFileSync(`data/5thSem/${key}Allotment.xlsx`, xlsData, 'binary')
        }
        // console.log(subjectWiseData)
        // const stringifiedData = JSON.stringify(allotedSeats, null, 2);
        // const selectionData = JSON.stringify(data, null, 2)
        // fs.writeFileSync("data/ElectiveSelection7thSem.json", selectionData)
        // fs.writeFileSync("data/ElectiveAllotment7thSem.json", stringifiedData);
    })
    .catch((err) => console.log(err));
