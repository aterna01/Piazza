const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const url = `mongodb+srv://dbUser:${process.env.MONGO_DB_PASSWORD}@cluster0.kw5d5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'myProject';

let client = null;

function _createClient(){
  return new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
}

function _getClient() {
  client = client === null ? _createClient() : client;
  return client
}

async function _getCollection(collName) {
  client = _getClient()
  await client.connect();
  const db = client.db(dbName);

  return db.collection(collName);
}

async function insertMany(collectionName, documents) {
  const collection = await _getCollection(collectionName)
  const insertResult = await collection.insertMany(documents);

  return insertResult;
}

async function insertOne(collectionName, document) {
  const collection = await _getCollection(collectionName)
  const insertResult = await collection.insertOne(document)

  return insertResult;
}

async function replaceOne(collectionName, filter, replacement) {
  const collection = await _getCollection(collectionName)
  const updateOneResult = await collection.replaceOne(filter, replacement)

  return updateOneResult;

}

async function find(collectionName, query = {}) {
  const collection = await _getCollection(collectionName)
  console.log("queryyy: ", query)
  const findResult = await collection.find(query).toArray();
  console.log("findResult: ", findResult)
  return findResult;
}


module.exports = {
  insertMany,
  insertOne,
  replaceOne,
  find
}
