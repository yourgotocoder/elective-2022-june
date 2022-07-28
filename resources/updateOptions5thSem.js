const { MongoClient } = require("mongodb");
const fs = require("fs");

const update = async () => {
    const client = await MongoClient.connect();
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const data = await collection.find().toArray();
    const _5thSemStudent = data.filter((student) => student.current_sem === 5);

    const elective_4_options = [
        "Digital Image Processing",
        "Artificial Neural Networks",
        "Information Transmission and Coding Theory",
        "Artificial Intelligence",
    ];
    for (let i = 0; i < _5thSemStudent.length; i++) {
        await collection.updateOne(
            { regNo: _5thSemStudent[i].regNo },
            {
                $set: {
                    
                    elective_4_options,
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
