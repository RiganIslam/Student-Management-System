const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const PORT = 5000;

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());


// =========================
// MongoDB
// =========================

const client = new MongoClient(process.env.MONGODB_URI);

let studentsCollection;


// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API is running",
  });
});


// =========================
// GET ALL STUDENTS
// =========================

app.get("/students", async (req, res) => {
  try {
    const students = await studentsCollection
      .find()
      .sort({ _id: -1 })
      .toArray();

    res.json(students);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to get students",
    });
  }
});


// =========================
// GET SINGLE STUDENT
// =========================

app.get("/students/:id", async (req, res) => {
  try {

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student = await studentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to get student",
    });
  }
});


// =========================
// ADD STUDENT
// =========================

app.post("/students", async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      department,
    } = req.body;


    // Validation

    if (!name || !email || !phone || !department) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    const student = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      createdAt: new Date(),
    };


    const result =
      await studentsCollection.insertOne(student);


    res.status(201).json({
      message: "Student added successfully",
      student: {
        _id: result.insertedId,
        ...student,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to add student",
    });
  }
});


// =========================
// UPDATE STUDENT
// =========================

app.put("/students/:id", async (req, res) => {
  try {

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }


    const {
      name,
      email,
      phone,
      department,
    } = req.body;


    if (!name || !email || !phone || !department) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    const updatedStudent = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
    };


    const result =
      await studentsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedStudent,
        }
      );


    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    res.json({
      message: "Student updated successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update student",
    });
  }
});


// =========================
// DELETE STUDENT
// =========================

app.delete("/students/:id", async (req, res) => {
  try {

    const id = req.params.id;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }


    const result =
      await studentsCollection.deleteOne({
        _id: new ObjectId(id),
      });


    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    res.json({
      message: "Student deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
});


// =========================
// START SERVER
// =========================

async function startServer() {

  try {

    await client.connect();

    const db = client.db("studentDB");

    studentsCollection =
      db.collection("students");


    console.log("MongoDB connected");


    app.listen(PORT, () => {

      console.log(
        `Server running on http://localhost:${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error
    );

  }
}


startServer();