import { MongoClient } from "mongodb";

async function connectToDatabase(): Promise<MongoClient> {
  const client = await MongoClient.connect(
    `${process.env.MONGO_CONNECTION_STRING}`
  );
  return client;
}

export default connectToDatabase;
