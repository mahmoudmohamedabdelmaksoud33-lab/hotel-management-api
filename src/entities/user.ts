import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("users") // اسم الجدول في قاعدة البيانات
export class User {
  @PrimaryGeneratedColumn("uuid") // معرف فريد يتم توليده تلقائياً كـ UUID
  id!: string;

  @Column({ type: "varchar", unique: true }) // البريد الإلكتروني يجب أن يكون فريداً
  email!: string;

  @Column({ type: "varchar" }) // كلمة المرور المشفرة
  password!: string;

  @Column({ type: "varchar" }) // اسم المستخدم
  name!: string;

  @Column({ type: "varchar", default: "guest" }) // دور المستخدم (guest أو admin)
  role!: string;

  @CreateDateColumn() // تاريخ إنشاء الحساب تلقائياً
  createdAt!: Date;
}
