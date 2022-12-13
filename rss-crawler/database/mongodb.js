const { MongoClient } = require("mongodb");


const connectionString = process.env.MONGO_CONNECTION;

console.log("MONGO CERTIFICATE")
console.log(process.env.MONGO_CERTIFICATE)

// Read the CA certificate and assign that to the CA variable
const ca = [Buffer.from(process.env.MONGO_CERTIFICATE, "base64")];
// We always want to make a validated TLS/SSL connection
const options = {
  ssl: true,
  sslValidate: true,
  sslCA: ca,
  useUnifiedTopology: true,
};


function create(database, collection, data) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, options, (err, client) => {
      if (err) reject(err);

      const db = client.db(database);

      db.collection(collection)
        .insertOne(data)
        .then((response) => {
          client.close();
          resolve(response.ops[0]);
        });
    });
  });
}

function list(database, collection, query = {}) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, options, (err, client) => {
      if (err) reject(err);

      const db = client.db(database);

      db.collection(collection)
        .find(query)
        .toArray()
        .then((data) => {
          client.close();
          resolve(data);
        });
    });
  });
}

function find(database, collection, query = {}) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, options, (err, client) => {
      if (err) reject(err);

      const db = client.db(database);

      db.collection(collection)
        .findOne(query)
        .then((data) => {
          client.close();
          resolve(data);
        });
    });
  });
}

function remove(database, collection, query = {}) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, options, (err, client) => {
      if (err) reject(err);

      const db = client.db(database);

      db.collection(collection)
        .deleteOne(query)
        .then((data) => {
          client.close();
          resolve(data);
        });
    });
  });
}

function update(database, collection, newDocument, query) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, options, (err, client) => {
      if (err) reject(err);

      const db = client.db(database);

      db.collection(collection)
        .findOneAndReplace(query, newDocument)
        .then((data) => {
          client.close();
          resolve(data);
        });
    });
  });
}

module.exports = {
  create,
  list,
  find,
  remove,
  update,
};
