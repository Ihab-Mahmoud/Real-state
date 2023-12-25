import "express-async-errors";

import express from "express";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
dotenv.config();

import notFound from "./middlewares/notFound.js"
import errorHandle from "./middlewares/errorHandler.js"

import authRouter from "./routes/auth-route.js";
import userRouter from "./routes/user-route.js";
import estateRouter from "./routes/estate-route.js";

import cookieParser from "cookie-parser";
import { authenticateUser } from "./middlewares/auth.js";

import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";


import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import cloudinary from "cloudinary";


const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./client/dist")));  


app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


// security configuration
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrcElem: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       connectSrc: ["www.googleapis.com"],
//       imgSrc: [
//         "'self'",
//         "*.unsplash.com",
//         "*.google.com",
//         "*.cloudinary.com",
//       ],
//     },
//   })
// );
// app.use(mongoSanitize()); 


// routes 
app.use("/api/v1", authRouter);
app.use("/api/v1/user", authenticateUser,userRouter);
app.use("/api/v1/estate", estateRouter);

// serve static files
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

// error handling 
app.use(notFound);
app.use(errorHandle);

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`server is listining  on ${PORT}`);
  });
} catch (error) {
  console.log(error);
}
