const { MongoClient } = require("mongodb")


const update = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("cse");
  const collection = db.collection("student-data");
  const data = await collection.find().toArray();
  console.log(data)
  const _7thSemStudents = data.filter(student => student.current_sem === 7);
  for (let i = 0; i < _7thSemStudents.length; i++) {
    const updatedStudent = await collection.updateOne(
      { regNo: _7thSemStudents[i].regNo },
      {
        $set: {
          open_elective_options: [
            "EC1722 Automation and Robotics",
            "CE1721 Fundamentals of Remote Sensing and GIS",
            "CE1741 Optimization Techniques",
            "EE1724 Machine Learning",
            "ME1726 Financial Planning and Analysis",
            "AD1722 Artificial Intelligence in Health Care",
            "IT1724 Geographical Information Systems",
            "BA1721 Entrepreneurship for Engineers"
          ],
        },
      }
    );
    console.log(`${ Math.floor((i / _7thSemStudents.length) * 100)}% done`)
  }
}

update().then(() => console.log(`Successfully added open elective for 7th sem`)).catch(err => console.log(err))
//EC1722 Automation and Robotics
//CE1721 Fundamentals of Remote Sensing and GIS
//CE1741 Optimization Techniques
//EE1724 Machine Learning
//ME1726 Financial Planning and Analysis
