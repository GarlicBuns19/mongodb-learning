const { MongoClient } = require("mongodb");

let client = new MongoClient("mongodb://0.0.0.0:27017/bookstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();
const db = client.db();

module.exports = {db}
