const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const data = reader.parseXls2Json(__dirname + "/4thAllotment.xlsx");
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(process.env.MONGO_URL);
    const db = client.db("cse");
    const collection = db.collection("student-data");
    for (let i = 0; i < data[0].length; i++) {
        const foundStudent = await collection.findOne({
            regNo: data[0][i].regNo,
        });
        if (foundStudent) {
            collection.updateOne(
                { regNo: data[0][i].regNo },
                {
                    $set: {
                        elective_1: data[0][i].Elective_1,
                        elective_2: data[0][i].Elective_2,
                    },
                }
            );
            console.log(`${data[0][i].regNo} elective history updated`);
        } else {
            console.log(`${data[0][i].regNo} elective data missing`);
        }
        console.log(`${Math.round((i / data[0].length) * 100)}% done`);
    }
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
