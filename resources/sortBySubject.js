const readExcel = require("simple-excel-to-json");
const json2xls = require("json2xls");
const fs = require("fs")

const data = readExcel.parseXls2Json(
    __dirname + "/ElectiveAllotment7thSem.xlsx"
)[0];

const subjects = {};
for (let student of data) {
    if (!subjects[student.first_elective]) {
        subjects[student.first_elective] = [];
        subjects[student.first_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    } else if (subjects[student.first_elective]) {
        subjects[student.first_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    }

    if (!subjects[student.second_elective]) {
        subjects[student.second_elective] = [];
        subjects[student.second_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    } else if (subjects[student.second_elective]) {
        subjects[student.second_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    }

    if (!subjects[student.third_elective]) {
        subjects[student.third_elective] = [];
        subjects[student.third_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    } else if (subjects[student.third_elective]) {
        subjects[student.third_elective].push({
            REGNO: student.REGNO,
            NAME: student.NAME,
        });
    }
}

for (let key in subjects) {
    const xls = json2xls(subjects[key]);
    fs.writeFileSync(`elective_fuck/${key}_Allotment.xlsx`, xls, "binary")
}

console.log(subjects);
