const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");

const data = reader.parseXls2Json(__dirname + "/StudentList.xlsx");
// console.log(data[0]);
const upload = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("cse");
  const collection = db.collection("student-data");
  for (let i = 0; i < data[0].length; i++) {
    const foundStudent = await collection.findOne({regNo: data[0][i].regNo});
    if (foundStudent) {
      console.log(`Student ${data[0][i].regNo} already in db`)
    } else {
      const studentToBeInserted = {
        regNo: data[0][i].regNo,
        name: data[0][i].name,
        section: data[0][i].section,
        current_sem: data[0][i].sem
      }
      const result = await collection.insertOne(studentToBeInserted);
      console.log(`${data[0][i].regNo} uploaded to db`);
    }
    console.log(`${Math.round((i / data[0].length) * 100)}% done`)
  }
}

upload().then(() => console.log("Successfully uploaded to db")).catch(err => console.log(err));