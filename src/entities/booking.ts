import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import { Room } from "./room";

export enum BookingStatus {
  PENDING = "PENDING", // في انتظار تأكيد تحويل الدفع (انستا باي / فودافون كاش)
  CONFIRMED = "CONFIRMED", // تم تأكيد الحجز واستلام المبلغ
  CHECKED_IN = "CHECKED_IN", // النزيل استلم الغرفة فعلاً
  CHECKED_OUT = "CHECKED_OUT", // النزيل ساب الغرفة وبدأت فترة الهاوس كيبيج
  COMPLETED = "COMPLETED", // تمت المغادرة (مضافة للتوافق)
  CANCELLED = "CANCELLED", // ملغي
}

export enum PaymentMethod {
  INSTAPAY = "INSTAPAY",
  VODAFONE_CASH = "VODAFONE_CASH",
  CASH_ON_ARRIVAL = "CASH_ON_ARRIVAL", // الدفع عند الوصول للريسبشن
}

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // ربط الحجز بالمستخدم (الموظف اللي سجل الحجز أو العميل لو بيحجز بنفسه)
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  // ربط الحجز بالغرفة المحجوزة
  @ManyToOne(() => Room, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "roomId" })
  room!: Room;

  @Column({ type: "timestamp" })
  checkInDate!: Date; // موعد الدخول الأساسي (الساعة 2 ظهراً)

  @Column({ type: "timestamp" })
  checkOutDate!: Date; // موعد الخروج الأساسي (الساعة 12 ظهراً اليوم التالي)

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.CASH_ON_ARRIVAL,
  })
  paymentMethod!: PaymentMethod;

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column({ type: "varchar", nullable: true })
  paymentReference!: string; // رقم تحويل انستا باي أو فودافون كاش للتأكيد

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
