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
  
  // current page
  //req.query.p is for ?p=0 after /books
  const page = req.query.p || 0;
  const booksPerPage = 3; 

  // store the books
  let books = [];

  col
    .find() // fetches a cursor object // methods are toArray which puts all docs into an array // forEach processes 1 doc at a time
    .sort({ author: 1 })
    .skip(page * booksPerPage) // skip these books and show the next
    .limit(booksPerPage) // Limit how much books is on screen
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

// Deleting in db
app.delete("/books/:id", (req, res) => {
  if(ObjectId.isValid(req.params.id)){
    col.deleteOne({_id : ObjectId(req.params.id)})
    .then((result) => {
      if(result.deletedCount == 1){
        res.json({
          status: 200,
          result : result
        })
      }else if(result.deletedCount == 0){
        res.json({
          status : 400,
          err: "Cannot find id in db",
          msg : err.message
        })
      }
    }).catch((err) => {
      res.json({
        status : 400,
        err: "Cannot find id in db",
        msg : err.message
      })
    })
  }else{
    res.json({
      status : 400,
      msg : "Not valid id in db"
    })
  }
});

// Updating a book
app.put('/books/:id',(req,res) => {
  let updates = req.body

  if (ObjectId.isValid(req.params.id)) {
    col
      .updateOne({ _id: ObjectId(req.params.id) },{$set : updates})
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
})

app.listen(3000, () => {
  console.log("app listening on port http://localhost:3000");
});
