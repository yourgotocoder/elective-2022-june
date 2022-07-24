const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");

const data = reader.parseXls2Json(__dirname + "/7thSemContactData.xlsx");
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(
        
    );
    const db = client.db("cse");
    const collection = db.collection("student-data");
    for (let i = 0; i < data[0].length; i++) {
        const foundStudent = await collection.findOne({
            regNo: data[0][i].regNo,
        });
        if (foundStudent) {
            await collection.updateOne(
                { regNo: foundStudent.regNo },
                {
                    $set: {
                        mobile_number: data[0][i].mobile_number
                            ? data[0][i].mobile_number
                            : null,
                        mobile_number_2: data[0][i].mobile_number_2
                            ? data[0][i].mobile_number_2
                            : null,
                        emailId: data[0][i].emailId,
                    },
                }
            );
            console.log(`${data[0][i].regNo} completed`);
        } else {
        }
        console.log(`${Math.round((i / data[0].length) * 100)}% done`);
    }
};

upload()
    .then(() => console.log("Successfully uploaded to db"))
    .catch((err) => console.log(err));
