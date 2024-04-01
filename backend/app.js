const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()


const mongoUrl =
  "mongodb+srv://rajatpandit06655:admin@cluster0.qohgyhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ;

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });
require("./UserDetails");
require("./UserDetails1");


const User = mongoose.model("UserInfo");
const User1 = mongoose.model("UserInfo1");



app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  console.log(req.body);

  //const oldUser = await User.findOne({ email: email });

  //if (oldUser) {
    //return res.send({ data: "User already exists!!" });
  //}
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      mobile,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});


app.post('/feedback',async (req, res) => {
  const { name,feedback } = req.body;
  try {
    await User1.create({
      name: name,
      feedback: feedback,
      
    });
    res.send({ status: "ok", data: "date recevied successfully" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }

});



app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.send({ status: "ok", data: token,name1:oldUser.name});
    } else {
      return res.send({ error: "error" });
    }
  }else{
    return res.send({status:"notok", data: "Invalid Credential" });

  }




});





const PORT=process.env;
app.listen(PORT, () => {
  console.log("Node js server started.");
});
