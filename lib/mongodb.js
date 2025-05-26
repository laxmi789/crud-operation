// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!global._mongoClient) {
  client = new MongoClient(uri, options);
  global._mongoClient = client.connect();
}

clientPromise = global._mongoClient;

export default clientPromise;


