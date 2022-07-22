const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");
let generatePassword = require("generate-password");

const data = reader.parseXls2Json(__dirname + "/StudentList.xlsx");
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect();
    const db = client.db("cse");
    const collection = db.collection("student-data");
    const data = await collection.find().toArray();
    for (let i = 0; i < data.length; i++) {
        await collection.updateOne(
            { regNo: data[i].regNo },
            {
                $set: {
                    passcode: generatePassword.generate({
                        excludeSimilarCharacters: true,
                        length: 6,
                    }),
                },
            }
        );
        console.log(
            `${data[i].regNo} done. ${Math.round(
                (i / data.length) * 100
            )}% completed`
        );
    }
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
