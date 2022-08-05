const { MongoClient } = require("mongodb");
const fs = require("fs");
const json2xls = require("json2xls");

const createMissingDataFile = (array, sem, field) => {
    const filteredData = array
        .filter((student) => student.current_sem === sem && !student[field] && student.elective_selections)
        .map((student) => ({ REGNO: student.regNo, NAME: student.name }));
    const xls = json2xls(filteredData);
    fs.writeFileSync(`data/Missing${sem}thSem${field}.xlsx`, xls, "binary");
};
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(
        "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const result = await collection.find().toArray();
    createMissingDataFile(result, 5, "cgpa");
    createMissingDataFile(result, 7, "cgpa");
    createMissingDataFile(result, 5, "elective_selections");
    createMissingDataFile(result, 7, "elective_selections");
    await client.close();
    // createMissingDataFile(result, 5, 'emailId');
    // createMissingDataFile(result, 7, 'emailId');
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
