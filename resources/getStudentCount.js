const { MongoClient } = require("mongodb");

const getCount = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("cse");
  const collection = db.collection("student-data");
  const data = await collection.find().toArray();
  const _7thSemStudents = data.filter((student) => student.current_sem === 7);
  const _5thSemStudents = data.filter((student) => student.current_sem === 5);
  console.log(_7thSemStudents.length);
  console.log(_5thSemStudents.length);
};

getCount().then(() => console.log(`Success`))