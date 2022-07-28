const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const keys = require("./private");
const fs = require("fs");

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
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "sudarshan.r@smit.smu.edu.in",
      pass: "7sgFPq3GS1cadHB6",
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
  for (let i = 0; i < _7thSemStudents.length; i++) {
    setTimeout(async () => {
      const sendEmail = async () => {
        const message = await transporter.sendMail({
          from: "cse.smit.engineers@gmail.com",
          to: _7thSemStudents[i].emailId,
          subject: "Elective passcode",
          html: `<div>Your passcode is <strong>${_7thSemStudents[i].passcode}</strong>.Copy paste it into the passcode area to avoid confusion.</div>`,
        });
      };
      sendEmail(data)
        .then(() => {
          console.log(
            `Email sent to ${_7thSemStudents[i].regNo}. ${Math.floor(
              (i / _7thSemStudents.length) * 100
            )} completed`
          );
          
        })
        .catch((err) => console.log(err));
    }, i * 2100);
  }
};

upload()
  .then(() => console.log("Successfully sent all the emails"))
  .catch((err) => console.log(err));
