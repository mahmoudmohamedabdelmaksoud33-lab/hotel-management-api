import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// أنواع الغرف بناءً على تسكين فندق الصفوة
export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  TRIPLE = "TRIPLE",
  QUAD = "QUAD",
  QUINT = "QUINT", // الخماسية زي 502
}

// حالة الغرفة الحقيقية لدورة العمل
export enum RoomStatus {
  AVAILABLE = "AVAILABLE", // متاحة للحجز والتشيك إن
  BOOKED = "BOOKED", // مشغولة بنزيل
  HOUSEKEEPING = "HOUSEKEEPING", // بين التشيك أوت والتشيك إن (12 - 2)
  MAINTENANCE = "MAINTENANCE", // صيانة
}

// نوع الإطلالة
export enum ViewType {
  BALCONY_STREET = "BALCONY_STREET", // بلكونة شارع الجيش
  WINDOW_STREET = "WINDOW_STREET", // شباك شارع
  WINDOW_SIDE = "WINDOW_SIDE", // شباك جانبي
  WINDOW_BACK = "WINDOW_BACK", // شباك خلفي (زي 101)
}

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  roomNumber!: string; // رقم الغرفة (101, 103, 502...)

  @Column({ type: "int" })
  floor!: number; // الدور (0 مطعم، 1 أول، 5 خامس...)

  @Column({ type: "enum", enum: RoomType })
  type!: RoomType;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerNight!: number; // السعر العادي (باقي أيام الأسبوع)

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  weekendPricePerNight!: number; // سعر الليلة يوم الخميس والجمعة (+50 جنيه)

  @Column({ type: "enum", enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status!: RoomStatus;

  @Column({ type: "enum", enum: ViewType })
  view!: ViewType;

  @Column({ type: "varchar", nullable: true })
  bedsDescription!: string; // وصف الأسرة ("2 سرير دورين + فردي")

  @Column({ type: "text", nullable: true })
  internalNotes!: string; // ملاحظات للريسبشن ("فيو خلفي رطش")

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
