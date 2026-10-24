import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  checkOutBooking,
} from "../controllers/bookingController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// عرض كل الحجوزات (محمي بالـ Token)
router.get("/", verifyToken, getAllBookings);

// إنشاء حجز جديد (محمي بالـ Token)
router.post("/", verifyToken, createBooking);

// تسجيل المغادرة وتحرير الغرفة (محمي بالـ Token)
router.patch("/:id/checkout", verifyToken, checkOutBooking);

export default router;
