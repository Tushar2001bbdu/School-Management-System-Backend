const express = require("express");
const User = require("../models/students");
const Router = express.Router();

const { body, validationResult } = require("express-validator");

// Load environment variables from .env file
require("dotenv").config();

const admin = require("firebase-admin");
const Results = require("../models/examresult");
const details = require("../models/feespaymentdetails");
const { authenticateStudentToken } = require("../middlewares/auth");

const app1 = admin.app("students");
const apiKey = process.env.APK1

let loggedIn = false;
//Route to see Details for a student in the Student Management System
Router.get(
  `/seeDetails`, authenticateStudentToken,

  async (req, res) => {
    try {
      if (loggedIn === false) {
        res.status(401).send("You have not logged in ");
      } else if (loggedIn === true) {
        let rollNo=req.query.rollno
        let user = await User.findOne({ rollno: rollNo });
       
        var JSON = {
          name: user.name,
          course: user.course,
          branch: user.branch,
          section: user.section,
          classTeacher: user.classTeacher,
          rollno:user.rollno,
          email:user.email,


        };

        res.status(200).json(JSON);
      }
    } catch (error) {
      res.status(500).send({ status: "some error has occured" });
    }
  }
);
//Route for logging in for a student in the Student Management System
Router.post(
  "/login",authenticateStudentToken,
 
  async (req, res) => {
    try {
      
      
        

       loggedIn=true
      res.status(200).send("You have logged in succcessfully")
      }
    catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);

Router.put(
  "/passwordResetEmail",authenticateStudentToken,
  [body("email", "Enter a valid e-mail").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        try {
          const link = await app1
            .auth()
            .generatePasswordResetLink(req.body.email);

          res.status(200).send("The password reset link is" + link);
        } catch (error) {
          res.status(500).send("There has been some error during the process");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);
Router.get(
  "/getResult",authenticateStudentToken,
  async (req, res) => {
    try {
      const rollno = req.query.rollno;
    
        if (loggedIn === true) {
          let user = await Results.findOne({ rollno: rollno });

          res.status(200).send(user);
        } else {
          res.status(401).send("You have not logged in successfully");
          // Error occurred. Inspect error.code.
        }
      }
    catch(error) {
      console.log(error);
      res.status(500).send("There has been some error during the process");
    }
  }
);

Router.get(
  "/getDetails",authenticateStudentToken,

  async (req, res) => {
    try {
    
     
        if (loggedIn === true) {
          let user = await details.findOne({ rollno: req.query.rollno });

          res.status(200).send(user);
        } else {
          res.status(401).send("You have not logged in successfully");
          // Error occurred. Inspect error.code.
        }
      }
     catch (error) {
      console.log(error);
      res.status(500).send("There has been some error during the process");
    }}
  
);

module.exports = Router;
