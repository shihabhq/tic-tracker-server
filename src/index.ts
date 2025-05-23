import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import { IStat, Stats } from "./schema/stats.js";

dotenv.config();

const app: express.Application = express();
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL!,
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.patch("/api/update-score", async (req, res): Promise<any> => {
  const { status, email } = req.body;
  if (!status || !email) {
    return res.status(400).json({ message: "status is required" });
  }
  try {
    const stats = await Stats.findOneAndUpdate(
      { email },
      {
        $inc: {
          played: 1,
          [status]: 1,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/create-user", async (req, res): Promise<any> => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }
  try {
    const userObj = {
      name,
      email,
      played: 0,
      lose: 0,
      won: 0,
      draw: 0,
    };
    const user = new Stats(userObj);
    await user.save();
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
});
