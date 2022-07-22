const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const data = reader.parseXls2Json(__dirname + "/4thAllotment.xlsx");
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(
        process.env.MONGO_CONNECTION_STRING
    );
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const result = await collection.find().toArray();
    const filteredResult = result.filter(
        (student) => student.current_sem === 5 && !student.elective_1
    );
    for (let i = 0; i < filteredResult.length; i++) {
        fs.appendFileSync("Missing4thSem.txt", `${filteredResult[i].regNo} \n`);
    }
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
