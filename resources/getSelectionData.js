const { MongoClient } = require("mongodb");
const json2xls = require("json2xls");
const fs = require("fs");

const selectionData = async () => {
    const client = await MongoClient.connect(
        "mongodb+srv://primary:SMIT01CSE@cluster0.i5fq9.mongodb.net/?retryWrites=true&w=majority"
    );

    const db = client.db("cse");
    const collection = db.collection("student-data");

    const data = await collection.find().toArray();

    await client.close();

    const _7thSemData = data
        .filter(
            (student) =>
                student.current_sem === 7 &&
                !student.cgpa &&
                student.elective_selections
        )
        .map((student) => ({
            REGNO: student.regNo,
            NAME: student.name,
            CGPA: student.cgpa,
            elective_option_1_1: student.elective_selections.first.option1_1,
            elective_option_1_2: student.elective_selections.first.option1_2,
            elective_option_1_3: student.elective_selections.first?.option1_3,
            elective_option_1_4: student.elective_selections.first?.option1_4,
            elective_option_2_1: student.elective_selections.second.option2_1,
            elective_option_2_2: student.elective_selections.second.option2_2,
            elective_option_2_3: student.elective_selections.second?.option2_3,
            elective_option_3_1: student.elective_selections.third.option3_1,
            elective_option_3_2: student.elective_selections.third.option3_2,
            elective_option_3_3: student.elective_selections.third.option3_3,
            elective_option_3_4: student.elective_selections.third.option3_4,
            elective_option_3_5: student.elective_selections.third.option3_5,
            elective_option_3_6: student.elective_selections.third?.option3_6,
            elective_option_3_7: student.elective_selections.third?.option3_7,
            elective_option_3_8: student.elective_selections.third?.option3_8,
        }));

    const _5thSemData = data
        .filter(
            (student) =>
                student.current_sem === 5 &&
                student.cgpa &&
                student.elective_selections
        )
        .sort((studentA, studentB) => studentB.cgpa - studentA.cgpa)
        .map((student) => ({
            REGNO: student.regNo,
            NAME: student.name,
            CGPA: student.cgpa,
            elective_option_1_1: student.elective_selections.first.option1_1,
            elective_option_1_2: student.elective_selections.first.option1_2,
            elective_option_1_3: student.elective_selections.first.option1_3,
            elective_option_2_1: student.elective_selections.second.option2_1,
            elective_option_2_2: student.elective_selections.second.option2_2,
            elective_option_2_3: student.elective_selections.second.option2_3,
            elective_option_2_4: student.elective_selections.second.option2_4,
        }));

    return {_5thSemData, _7thSemData};
};

selectionData()
    .then((data) => {
        const _5thXls = json2xls(data._5thSemData);
        const _7thXls = json2xls(data._7thSemData);

        fs.writeFileSync(`data/_7thSemSelectionDataCGPAMissing.xlsx`, _7thXls, "binary");
        // fs.writeFileSync(`data/_5thSemSelectionData.xlsx`, _5thXls, "binary");

        console.log("Success")
    })
    .catch((err) => console.log(err));
