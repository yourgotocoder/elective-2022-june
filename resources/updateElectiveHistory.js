const reader = require("simple-excel-to-json");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const getSubjectCode = (subject) => {
    let code;
    switch (subject) {
        case "Soft Skills and Interpersonal Communication":
            code = "CS1657";
            break;
        case "Introduction to Haskell Programming":
            code = "CS1670";
            break;
        case "Agile Methodology":
            code = "CS1650";
            break;
        case "Design Thinking":
            code = "CS1669";
            break;
        case "Social Network Analysis":
            code = "CS1641";
            break;
        case "Internet of Things":
            code = "CS1757";
            break;
        case "Artificial Intelligence":
            code = "CS1644";
            break;
        case "Blockchain Coding":
            code = "CS1760";
            break;
        case "Machine Learning":
            code = "CS1741";
            break;
        case "Speech and Natural Language Processing":
            code = "CS1646";
            break;
    }
    return code;
};

const data = reader.parseXls2Json(__dirname + "/6thSemElectiveAllotment.xlsx");
// console.log(data[0]);
const upload = async () => {
    const client = await MongoClient.connect(
        process.env.MONGO_CONNECTION_STRING
    );
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
                        elective_5: data[0][i].Elective_5
                            ? `${getSubjectCode(data[0][i].Elective_5)} ${
                                  data[0][i].Elective_5
                              }`
                            : null,
                        elective_6: data[0][i].Elective_6
                            ? `${getSubjectCode(data[0][i].Elective_6)} ${
                                  data[0][i].Elective_6
                              }`
                            : null,
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
