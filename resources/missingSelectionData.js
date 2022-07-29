const { MongoClient } = require("mongodb");
const fs = require("fs");

const getMissingSelectionData = () => {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    readline.question(
        "Enter the semester for which you want the missing data: ",
        async (semester) => {
            console.log(`Your entered semester is ${semester}`);
            const client = await MongoClient.connect(
                "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
            );
            const db = client.db("cse");
            const collection = db.collection("student-data");
            const data = await collection.find().toArray();
            const filteredData = data.filter(
                (student) =>
                    student.current_sem === +semester &&
                    !student.elective_selections
            );
            const transformedData = filteredData.map(
                (student) => `Regno: ${student.regNo}, Name: ${student.name}`
            );
            const missingData = JSON.stringify(transformedData, null, 2);
            fs.writeFileSync(
                `data/MissingSelectionData${semester}.txt`,
                `Total Count: ${
                    transformedData.length
                } at ${new Date().getHours()}:${new Date().getMinutes()}${
                    new Date().getHours() >= 12 ? "pm" : "am"
                },${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}\n ${missingData}`
            );
            client.close();
            readline.close();
        }
    );
};

getMissingSelectionData();
