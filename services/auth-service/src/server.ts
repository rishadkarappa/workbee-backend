import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./infrastructure/config/connectMongo";
import UserRoutes from './presentation/routes/UserRoutes'

dotenv.config();
const PORT = process.env.PORT

const app = express();
app.use(express.json());

app.use("/", UserRoutes)

connectDatabase().then(() => {
  app.listen(PORT, () => console.log('Auth Service running on port 4001'))
})
