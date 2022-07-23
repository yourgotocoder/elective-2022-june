// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/dbConnect";

type Data = {
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const data = req.body;
        const client = await connectToDatabase();
        const db = client.db("cse");
        const collection = db.collection("student-data");
        const elective_selections = {
            first: {
                option1_1: data.option1_1,
                option1_2: data.option1_2,
                option1_3: data.option1_3,
                option1_4: data.option1_4,
            },
            second: {
                option2_1: data.option2_1,
                option2_2: data.option2_2,
                option2_3: data.option2_3,
                option2_4: data.option2_4,
            },
        };
        await collection.updateOne(
            { regNo: data.regNo },
            { $set: { elective_selections } }
        );
        console.log(data);
        res.status(200).json({ message: "John Doe" });
    }
}
