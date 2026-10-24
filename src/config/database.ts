// تحميل المتغيرات البيئية من ملف .env
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/user";
import { Room } from "../entities/room";
import { Booking } from "../entities/booking";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [User, Room, Booking], // تم إضافة Booking بجوار User و Room بنجاح
  migrations: [],
  subscribers: [],
});
