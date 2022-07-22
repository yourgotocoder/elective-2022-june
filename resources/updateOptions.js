const { MongoClient } = require("mongodb");
const fs = require("fs");

const update = async () => {
    const client = await MongoClient.connect();
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const data = await collection.find().toArray();
    const _5thSemStudent = data.filter((student) => student.current_sem === 7);
    const elective_7_options_prefilter = [
        "CS1733 Cryptography & Network Security",
        "CS1756 R Programming",
        "CS1650 Agile Methodology",
        "CS1789 Engineering Research Methodology",
    ];
    const elective_8_options_prefilter = [
        "CS1746 Human Computer Interaction",
        "CS1659 Ethical Hacking",
        "CS1631 Deep Learning",
    ];
    for (let i = 0; i < _5thSemStudent.length; i++) {
        const alreadyStudied = [];
        _5thSemStudent[i].elective_1 &&
            alreadyStudied.push(_5thSemStudent[i].elective_1);
        _5thSemStudent[i].elective_2 &&
            alreadyStudied.push(_5thSemStudent[i].elective_2);
        _5thSemStudent[i].elective_3 &&
            alreadyStudied.push(_5thSemStudent[i].elective_3);
        _5thSemStudent[i].elective_4 &&
            alreadyStudied.push(_5thSemStudent[i].elective_4);
        _5thSemStudent[i].elective_5 &&
            alreadyStudied.push(_5thSemStudent[i].elective_5);
        _5thSemStudent[i].elective_6 &&
            alreadyStudied.push(_5thSemStudent[i].elective_6);
        const elective_7_options = elective_7_options_prefilter.filter(
            (subject) => !alreadyStudied.includes(subject)
        );
        const elective_8_options = elective_8_options_prefilter.filter(
            (subject) => !alreadyStudied.includes(subject)
        );
        await collection.updateOne(
            { regNo: _5thSemStudent[i].regNo },
            {
                $set: {
                    elective_7_options,
                    elective_8_options,
                },
            }
        );
        console.log(
            `${_5thSemStudent[i].regNo} done. ${Math.round(
                (i / _5thSemStudent.length) * 100
            )}% completed`
        );
    }
};

update()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
