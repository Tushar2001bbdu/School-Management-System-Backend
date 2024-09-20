const express = require("express");
const teachers = require("../models/teachers");
const students = require("../models/students");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const studentresult = require("../models/examresult");
// Load environment variables from .env file
require("dotenv").config();

const User = require("../models/students");
const admin = require("firebase-admin");
const { authenticateTeacherToken } = require("../middlewares/auth");

const app2 = admin.app("teachers");
const apiKey = process.env.APK2;
var loggedIn = false;

//Route to see Details of a Teacher in the Student Management System
Router.get(
  "/seeDetails",
  authenticateTeacherToken,

  async (req, res) => {
    if (loggedIn === true) {
      try {
        try {
          let rollno = req.query.rollno;
          let teacher = await teachers.findOne({ rollno: rollno });

          var JSON = {
            name: teacher.name,
            course: teacher.course,
            age: teacher.age,
            gender: teacher.gender,
            rollno: teacher.rollno,
            attendance: teacher.attendance,
            email: teacher.email,
          };

          res.status(200).json(JSON);
        } catch (error) {
          
          res.status(500).send({ status: "some error has occured" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "some error has occured" });
      }
    } else {
      res.status(401).send("You have not logged in currently");
    }
  }
);

Router.get("/getStudentProfile", authenticateTeacherToken, async (req, res) => {
  try {
    let rollno = req.query.rollno;
    if (!rollno) {
      res
        .status(500)
        .send({ status: false, message: "no roll number has been entered" });
    }
    let profile = await students.findOne({ rollno: rollno });
    if (!profile) {
      res
        .status(404)
        .send({ status: false, message: "invalid rollno has been entered" });
    }
    res.status(200).send({ status: true, profile: profile });
  } catch (error) {
    res.status(500).send({ status: false, message: "some error has occured" });
  }
});
//Route for logging in for a teacher in the Student Management System
Router.post(
  "/login",
  authenticateTeacherToken,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "cannot be blank").exists(),
  ],

  async (req, res) => {
    try {
      let result = validationResult(req);
      if (!result) {
        res.json({ success: "false" });
      } else {
        loggedIn = true;
        res.status(200).send({
          status: true,
          message: "You have logged in successfully",
        });
      }
    } catch (error) {
      res
        .status(500)
        .send({ status: false, message: "Some error has occurred" });
    }
  }
);
//Route to get List Of Students
Router.get("/listOfStudents", authenticateTeacherToken, async (req, res) => {
  try {
    let rollno = req.query.rollno;
    let section = req.query.section;

    if (!rollno) {
      res
        .status(500)
        .json({ status: false, message: "no roll number has been entered" });
    }
    let student = await students.find({ section: section });
    if (!students) {
      res
        .status(404)
        .json({ status: false, message: "invalid rollno has been entered" });
    }
    res.status(200).json({ status: true, studentList: student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "some error has occured" });
  }
});

//Route to allow  teacher to update marks of his/her students using his university roll no
Router.patch("/updateResult", authenticateTeacherToken, async (req, res) => {
  try {
    if (loggedIn === true) {
      let grade = "F";

      if (req.body.marks > 0 && req.body.marks < 40) {
        grade = "F";
      } else if (req.body.marks > 40 && req.body.marks <= 60) {
        grade = "E";
      } else if (req.body.marks > 60 && req.body.marks <= 65) {
        grade = "D";
      } else if (req.body.marks > 65 && req.body.marks <= 80) {
        grade = "C";
      } else if (req.body.marks > 80 && req.body.marks <= 90) {
        grade = "B";
      } else if (req.body.marks > 80 && req.body.marks <= 90) {
        grade = "B";
      } else if (req.body.marks > 90 && req.body.marks < 90) {
        grade = "A";
      } else {
        grade = "O";
      }
      let response = await studentresult.findOne({ rollno: req.body.rollno });
      if (response === null) {
        res.status(404).json({
          "status": "false",
         "message": "There is no such student account",
        });
      } else {
        response = await studentresult.findOneAndUpdate(
          { rollno: req.body.rollno },
          { $set: { marks: req.body.marks, grade: grade } }
        );
        response=await studentresult.findOne({
          rollno:req.body.rollno
        })
        console.log(response)
        res.status(200).json({
          "status": "true",
          "message": "the result of student has been updated successfully",
        });
      }
    } else {
      res.status(401).json({
        
        "status": "false",
        "message": "You have not logged in successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "status": "false",
      "message": "some error has occurred",
    });
  }
});
Router.put(
  "/passwordResetEmail",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "cannot be blank").exists(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        try {
          const link = await app2
            .auth()
            .generatePasswordResetLink(req.body.email);
          console.log(link);
          res.status(200).send("A password reset email has been sent");
        } catch (error) {
          console.log(error);
          res.status(200).send("There has been some error during the process");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);

module.exports = Router;
