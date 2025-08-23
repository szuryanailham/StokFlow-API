import express from "express";
import cors from "cors";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/api.js";

export const web = express();

// konfigurasi cors
const corsOptions = {
  origin: "http://localhost:3001", // asal frontend (React/Next.js)
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// apply cors middleware
web.use(cors(corsOptions));

web.use(express.json());

// router
web.use(publicRouter);
web.use(userRouter);

// error handling
web.use(errorMiddleware);
