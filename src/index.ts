import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import { Stats } from "./schema/stats.js";

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

app.post("/api/update-score", async (req, res): Promise<any> => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }
  try {
    const stats = await Stats.findOneAndUpdate(
      {},
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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
});
