// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../lib/dbConnect";

type Data = {
  message: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { regno, passcode } = req.body;
    if (regno === "") {
      res.status(400).json({ message: "Registration number is required" });
      return;
    }
    if (passcode === "") {
      res.status(400).json({ message: "Passcode is required" });
      return;
    }
    const client = await connectToDatabase();
    const db = client.db("cse");
    const collection = db.collection("student-data");
    console.log(regno);
    const foundStudent = await collection.findOne({ regNo: +regno });
    console.log(foundStudent);
    if (!foundStudent) {
      res
        .status(404)
        .json({ message: "Registration number does not exist in db" });
      return;
    }
    if (foundStudent) {
      if (passcode !== foundStudent.passcode) {
        res.status(403).json({ message: "Wrong passcode. Please try again" });
        return;
      }
      const userData = { ...foundStudent };
      delete userData.passcode;
      const token = jwt.sign(
        userData,
        process.env.SECRET
          ? process.env.SECRET
          : "t53d798fhi3sg8r4h8gd97dfuiog7dfgy789d34cyn",
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Found", token });
    }
  }
}
