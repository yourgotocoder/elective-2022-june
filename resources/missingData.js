const { MongoClient } = require("mongodb");
const fs = require("fs");

const createMissingDataFile = (array, sem, field) => {
    const filteredData = array.filter(student => student.current_sem === sem && !student[field]).map(student => student.regNo + " " + student.name);
    fs.writeFileSync(`Missing${sem}thSem${field}.json`, JSON.stringify(filteredData));
}
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(
      
    );
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const result = await collection.find().toArray();
    createMissingDataFile(result, 5, 'cgpa');
    createMissingDataFile(result, 7, 'cgpa');
    createMissingDataFile(result, 5, 'emailId');
    createMissingDataFile(result, 7, 'emailId');
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
