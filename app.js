const express = require("express");
const { ObjectId } = require("mongodb");
const { db } = require("./db");
// init app & middleware
const app = express();
app.use(express.json());
// db connection
let col = db.collection("books");

// routes
// All books
app.get("/books", (req, res) => {
  let books = [];

  col
    .find() // fetches a cursor object // methods are toArray which puts all docs into an array // forEach processes 1 doc at a time
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      if (books.length > 0) {
        res.status(200).json({
          status: 200,
          results: books,
        });
      } else {
        res.json({
          status: 400,
          err: "No books in store",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 400,
        err: "Could not fetch books",
        msg: err.message,
      });
    });

  // res.json({ mssg: "welcome to the api" });
});

// Single book
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    col
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            status: 200,
            results: doc,
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 400,
          err: "This book not in store",
          msg: err.message,
        });
      });
  } else {
    res.json({
      status: 400,
      msg: "Not valid id",
    });
  }
});

// Adding a Book
app.post("/books", (req, res) => {
  let book = req.body;

  col
    .insertOne(book)
    .then((result) => {
      res.json({
        status: 201,
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        status: 400,
        err: "Could not add book",
        msg: err.msg,
      });
    });
});

app.listen(3000, () => {
  console.log("app listening on port http://localhost:3000");
});
