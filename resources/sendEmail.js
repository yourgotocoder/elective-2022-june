const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

// console.log(data[0]);
const upload = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("cse");
  const collection = db.collection("student-data");
  const data = await collection.find().toArray();
  const _5thSemStudents = data.filter((student) => student.current_sem === 5);
  const _7thSemStudents = data.filter((student) => student.current_sem === 7);

  const transporter = nodemailer.createTransport({
    host: "",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
  });

  // for (let i = 0; i < _5thSemStudents.length; i++) {
  //   const message = transporter.sendMail({
  //     from: "",
  //     to: _5thSemStudents[i].emailId,
  //     subject: "Elective passcode",
  //     html: `<div>Your passcode is <strong>${_5thSemStudents[i].passcode}</strong>.Copy paste it into the passcode area to avoid confusion.</div>`,
  //   });
  // }
  // for (let i = 0; i < _7thSemStudents.length; i++) {
  //   const message = transporter.sendMail({
  //     from: "",
  //     to: _5thSemStudents[i].emailId,
  //     subject: "Elective passcode",
  //     html: `<div>Your passcode is <strong>${_5thSemStudents[i].passcode}</strong>.Copy paste it into the passcode area to avoid confusion.</div>`,
  //   });
  // }
};

upload()
  .then(() => console.log("Successfully sent all the emails"))
  .catch((err) => console.log(err));
