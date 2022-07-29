const { MongoClient } = require("mongodb");
const xlsx = require("json-as-xlsx");
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
                student.current_sem === 7 &&
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
            elective_5: student.elective_5,
            elective_6: student.elective_6,
            elective_selections: student.elective_selections,
        }));

    return _7thSemData;
};

electiveAllotment()
    .then((data) => {
        fs.writeFileSync(
            `data/PreAllotmentTransformedData7thSem.json`,
            JSON.stringify(data, null, 2)
        );
    })
    .catch((err) => console.log(err));
