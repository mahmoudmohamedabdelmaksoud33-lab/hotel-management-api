import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import bookingRoutes from "./routes/bookingRoutes"; // استيراد مسارات الحجوزات

const app: Application = express();

app.use(express.json());

// ربط مسارات الـ Auth
app.use("/api/auth", authRoutes);

// ربط مسارات الـ Rooms
app.use("/api/rooms", roomRoutes);

// ربط مسارات الـ Bookings (الحجوزات)
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy!" });
});

export default app;
