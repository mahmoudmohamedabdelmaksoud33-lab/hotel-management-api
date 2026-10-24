import { Router } from "express";
import { getAllRooms, createRoom } from "../controllers/roomController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// عرض الغرف (متاح للجميع)
router.get("/", getAllRooms);

// إضافة غرفة جديدة (محمي بالـ Token)
router.post("/", verifyToken, createRoom);

export default router;
