import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  matricNo: text("matric_no").notNull().unique(),
  gmail: text("gmail").notNull().unique(),
  department: text("department"),
  level: text("level"),
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status", { enum: ["lost", "found", "claimed"] }).notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  image: text("image"),
  description: text("description").notNull(),
  reporterName: text("reporter_name").notNull(),
  reporterContact: text("reporter_contact").notNull(),
  reporterId: varchar("reporter_id").references(() => users.id),
  claimedAt: timestamp("claimed_at"),
  holderInfo: text("holder_info"), // school number or holder contact
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  password: true,
  fullName: true,
  matricNo: true,
  gmail: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  matricNo: z.string().min(1, "Matric number is required"),
  gmail: z.string().email("Invalid email address"),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});

export const updateUserSchema = z.object({
  fullName: z.string().optional(),
  department: z.string().optional(),
  level: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("userId").references(() => users.id).notNull(),
  message: text("message").notNull(),
  date: timestamp("date").defaultNow(),
  read: text("read").default(sql`'false'`), // using text for boolean simulation in pg if needed, or just boolean
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  date: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
