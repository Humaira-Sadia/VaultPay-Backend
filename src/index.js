import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
// import userRouter from "./routes/userRouter";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api/users", userRouter);

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));