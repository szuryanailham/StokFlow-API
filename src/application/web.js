import express from "express";
import cors from "cors";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/api.js";

export const web = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://www.frontenddomain.com"];

const corsOptions = {
  origin: function (origin, callback) {
    // Jika origin ada di allowedOrigins atau request tidak ada origin (misal Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
