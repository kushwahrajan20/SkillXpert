// stripe listen --forward-to http://localhost:8080/api/v1/purchase/webhook
import express from 'express';
import dotenv from 'dotenv';
import userRoute from './route/user.route.js';
import cookieParser from 'cookie-parser';
import connectDB from './database/db.js';
import cors from 'cors';
import courseRoute from './route/course.route.js';
import mediaRoute from './route/media.route.js';
import purchaseRoute from './route/purchaseCourse.route.js'
import courseProgressRoute from './route/courseProgress.route.js'

dotenv.config({});

connectDB();
const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "https://skill-xpert.vercel.app"], // Update with your client URL
  credentials: true,
}));

//apis

app.use("/api/v1/media", mediaRoute );
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress",courseProgressRoute);

app.get("/home", (_, res) => {
  res.status(200).json({
    success: true,
    message: "BrightPath API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
})