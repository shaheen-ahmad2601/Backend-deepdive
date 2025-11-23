// require('dotenv').config({path: './env'}); // should be in index.js at the top most level - common.js
import dotenv from "dotenv"; // ES6 module syntax
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" }); // load env variables from .env file

connectDB() // this will return a promise and further handle this.
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect DB in index.js", err);
  });


  

// function connectDB(){}

// connectDB()

/*
first approach
import express from "express";
const app = express();

;(async () => { // IFFE- semicolon added to avoid issues if previous code doesn't end with semicolon
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");
    app.on("error", (error) => {
      console.log("Failed to connect with MongoDB", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
*/
