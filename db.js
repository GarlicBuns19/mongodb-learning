const { MongoClient } = require("mongodb");

/* instead of this
const url = "mongodb://localhost:27017";

Just Replace
const url = "mongodb://0.0.0.0:27017";*/
let url = "mongodb://0.0.0.0:27017/bookstore"

let client = new MongoClient(url, {
  // MongoTopologyClosedError: Topology is closed Fix Below
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connecting , put in async
client.connect();

// The whole database
const db = client.db();

// Exporting the db
module.exports = {db}
