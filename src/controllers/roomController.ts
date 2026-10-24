import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Room } from "../entities/room";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const roomRepository = AppDataSource.getRepository(Room);

// عرض كل الغرف
export const getAllRooms = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const rooms = await roomRepository.find();
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// إضافة غرفة جديدة
export const createRoom = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      roomNumber,
      floor,
      type,
      pricePerNight,
      weekendPricePerNight,
      view,
      bedsDescription,
      internalNotes,
    } = req.body;

    const existingRoom = await roomRepository.findOne({
      where: { roomNumber },
    });
    if (existingRoom) {
      res.status(400).json({ message: "Room number already exists!" });
      return;
    }

    const newRoom = roomRepository.create({
      roomNumber,
      floor,
      type,
      pricePerNight,
      weekendPricePerNight: weekendPricePerNight || Number(pricePerNight) + 50,
      view,
      bedsDescription,
      internalNotes,
    });

    await roomRepository.save(newRoom);

    res.status(201).json({
      message: "Room created successfully! 🏨",
      room: newRoom,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
