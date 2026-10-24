import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Booking, BookingStatus, PaymentMethod } from "../entities/booking";
import { Room, RoomStatus } from "../entities/room";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const bookingRepository = AppDataSource.getRepository(Booking);
const roomRepository = AppDataSource.getRepository(Room);

// إنشاء حجز جديد مع حساب الأسعار أوتوماتيك (وتطبيق زيادة الويك إند الخميس والجمعة)
export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      paymentMethod,
      paymentReference,
    } = req.body;
    const userId = req.user?.id; // المستخدم المسجل (الموظف أو العميل)

    if (!userId) {
      res.status(401).json({ message: "Unauthorized user!" });
      return;
    }

    // 1. التأكد من وجود الغرفة وحالتها
    const room = await roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ message: "Room not found!" });
      return;
    }

    if (room.status !== RoomStatus.AVAILABLE) {
      res
        .status(400)
        .json({ message: "Room is not available for booking right now!" });
      return;
    }

    // 2. حساب عدد الأيام وتطبيق سعر الويك إند (الخميس والجمعة)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    let totalPrice = 0;
    let currentDate = new Date(checkIn);

    while (currentDate < checkOut) {
      const dayOfWeek = currentDate.getDay(); // 4 = الخميس، 5 = الجمعة
      const isWeekend = dayOfWeek === 4 || dayOfWeek === 5;

      if (isWeekend && room.weekendPricePerNight) {
        totalPrice += Number(room.weekendPricePerNight);
      } else {
        totalPrice += Number(room.pricePerNight);
      }

      // الانتقال لليوم التالي
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 3. إنشاء الحجز
    const newBooking = bookingRepository.create({
      user: { id: userId },
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      paymentMethod: paymentMethod || PaymentMethod.CASH_ON_ARRIVAL,
      status:
        paymentMethod === PaymentMethod.CASH_ON_ARRIVAL
          ? BookingStatus.CONFIRMED
          : BookingStatus.PENDING,
      paymentReference: paymentReference || null,
    });

    await bookingRepository.save(newBooking);

    // تحديث حالة الغرفة لتصبح مشغولة أو محجوزة
    room.status = RoomStatus.BOOKED;
    await roomRepository.save(room);

    res.status(201).json({
      message: "Booking created successfully! 🏨✨",
      totalPrice,
      booking: newBooking,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// عرض كل الحجوزات
export const getAllBookings = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const bookings = await bookingRepository.find({
      relations: {
        room: true,
        user: true,
      },
    });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// تسجيل المغادرة (Check-Out) وتحرير الغرفة
export const checkOutBooking = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params; // معرف الحجز

    const booking = await bookingRepository.findOne({
      where: { id: id as any },
      relations: {
        room: true,
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found!" });
      return;
    }

    if (booking.status === ("COMPLETED" as any)) {
      res.status(400).json({ message: "This booking is already checked out!" });
      return;
    }

    // تحديث حالة الحجز إلى مكتمل
    booking.status = "COMPLETED" as any;
    await bookingRepository.save(booking);

    // تحرير الغرفة وإرجاع حالتها متاحة (AVAILABLE)
    if (booking.room) {
      booking.room.status = RoomStatus.AVAILABLE;
      await roomRepository.save(booking.room);
    }

    res.status(200).json({
      message: "Check-out completed successfully! Room is now available. 🏨🔓",
      booking,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
