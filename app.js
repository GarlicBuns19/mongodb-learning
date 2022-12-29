const express = require("express");
const { db } = require("./db");
// init app & middleware
const app = express();

// db connection
let col = db.collection("books");

// routes
app.get("/books", (req, res) => {
  let books = [];
  
  col
  .find() // fetches a cursor object // methods are toArray which puts all docs into an array // forEach processes 1 doc at a time
  .sort({ author: 1 })
  .forEach((book) => books.push(book))
  .then(() => {
    if(books.length > 0){
      res.status(200).json({
        status: 200,
        results: books,
      });
    }else{
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

app.listen(3000, () => {
  console.log("app listening on port http://localhost:3000");
});