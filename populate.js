import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Estate from "./models/estate-model.js";
import User from "./models/user-model.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'test@gmail.com' });

  const jsonEstates = JSON.parse(
    await readFile(new URL("./utils/MOCK_DATA (2).json", import.meta.url))
  );
  const Estates = jsonEstates.map((Estate) => {
    return { ...Estate, createdBy: user._id };
  });
  await Estate.deleteMany({ createdBy: user._id });
  await Estate.create(Estates);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
