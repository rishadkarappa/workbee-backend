import express from "express";
import mongoose from "mongoose";
import authRoutes from "./interface/routes/auth.routes";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT

const app = express();
app.use(express.json());

app.use("/", authRoutes)

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Auth Service running on 4001"))
  })
  .catch(err => console.error(err));


