const connectToMongo = require("./db");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
app.use(express.json());

const credentials = require("./Student-Account-Key.json");
if (admin.apps.length === 0) {
  admin.initializeApp(
    {
      credential: admin.credential.cert(credentials),
    },
    "students"
  );
}
if (admin.apps.length === 1) {
  const credentialsOfTeachers = require("./Teacher-Account-Key.json");
  admin.initializeApp(
    {
      credential: admin.credential.cert(credentialsOfTeachers),
    },
    "teachers"
  );
}

connectToMongo();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cookieParser());

const port = 3001 || process.env.PORT;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/app/users", require("./routes/students"));

app.use("/app/details", require("./routes/management"));
app.use("/app/teachers", require("./routes/teachers"));

app.listen(3001, () => {
  console.log(`Student Management System Server listening on port ${port}`);
});
