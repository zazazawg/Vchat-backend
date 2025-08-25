import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";
dotenv.config({});

// middlewares



const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// routes
app.use("/api/user",userRoute);

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})