const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");

const data = reader.parseXls2Json(__dirname + "/5thSemEmailIds.xlsx");
// console.log(data[0]);
const upload = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("cse");
  const collection = db.collection("student-data");
  for (let i = 0; i < data[0].length; i++) {
    const foundStudent = await collection.findOne({ regNo: data[0][i].regNo });
    if (foundStudent) {
      const updatedStudent = await collection.updateOne(
        { regNo: data[0][i].regNo },
        {
          $set: {
            emailId: data[0][i].emailId,
            mobile_number: data[0][i].mobile
          },
        }
      );
    }
    console.log(`Updated email for ${data[0][i].regNo} ${ Math.round((i / data[0].length) * 100) }% done`);
  }
};

upload()
  .then(() => console.log("Successfully uploaded to db"))
  .catch((err) => console.log(err));
