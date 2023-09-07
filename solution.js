// import express from "express";
// import bodyParser from "body-parser";
const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require('mongoose')

const app = express();
const port = 4000;

//CORS POLICY
const cors = require('cors');
const corsOptions ={
  origin: '*', 
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const dotenv = require("dotenv")   //requiring dotenv
dotenv.config({ path: "./config.env" })

//DATABASE CONNECTION
require("./db/connection")
const Note = require('./model/NoteSchema')


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Separate posts into columns
const column1 = [
];
const column2 = [
];
const column3 = [
];

// GET all posts
app.get("/posts", (req, res) => {

  // Clear existing data in columns
  column1.length = 0; 
  column2.length = 0;
  column3.length = 0;


  Note.find()
  .then(notes => {
    notes.forEach(async(note, index) => {
      // console.log(note)
      if (note.columnId === "1") {
       await column1.push(note);
      } else if (note.columnId === "2") {
       await column2.push(note);
      } else {
       await column3.push(note);
      }
    });
 
    res.json({ column1, column2, column3 });
  })





// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  
  
Note.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) })
.then(foundNote => {
  if (foundNote) {
    res.json(foundNote);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
})
.catch(error => {
  console.log(error)
});



// POST a new post
app.post("/posts", (req, res) => {
  const newId = lastId += 1;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
    // columnId: req.body.columnId
  };
  const note = new Note(
    {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      columnId: req.body.columnId
    }
  );
  note.save()


  res.status(201).json(post);
});


app.patch("/posts/:id", async (req, res) => {
  try {
    const foundNote = await Note.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) });
      newId=req.body.columnId;


    
    if (!foundNote) {
      return res.status(404).json({ message: "Post not found" });
    }
    if(req.body.columnId){
      foundNote.columnId=newId
    }
    if (req.body.title) {
      foundNote.title = req.body.title;
    }
    if (req.body.content) {
      foundNote.content = req.body.content;
    }
    if (req.body.author) {
      foundNote.author = req.body.author;
    }
    console.log(foundNote.columnId)
    if (foundNote.columnId === "1") {
       column1.push(foundNote);
     } else if (foundNote.columnId === "2") {
       column2.push(foundNote);
     } else {
       column3.push(foundNote);
     }
    const updatedNote = await foundNote.save();

    res.json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating post" });
  }
});

  
// DELETE a specific post by providing the post id
app.delete("/posts/:id", (req, res) => {


  Note.deleteOne({ _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) })
.then(res.json("successfully deleted"))
.catch(error => {
  // console.log(error)
  res.status(500).json({ message: "Error deleting post" });
  
});

  // posts.splice(index, 1);
  // res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
