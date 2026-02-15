import { type User, type InsertUser, type UpdateUser, type Item, type InsertItem, type Notification, type InsertNotification } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(gmail: string): Promise<User | undefined>;
  getUserByMatricNo(matricNo: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User | undefined>;

  // Item methods
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem & { reporterId?: string }): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;
  resolveItem(id: string, holderInfo: string): Promise<Item | undefined>;
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  deleteNotification(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.notifications = new Map();
    // Seed initial data
    this.seedItems();
    // Start cleanup job for claimed items older than 2 days
    setInterval(() => this.cleanupClaimedItems(), 1000 * 60 * 60); // Every hour
  }

  private seedItems() {
    const initialItems = [
      {
        id: "1",
        name: "Blue Hydro Flask",
        category: "Bottles",
        status: "lost",
        location: "ELT",
        date: "May 15, 2025",
        image: "https://images.unsplash.com/photo-1602143399435-09ce15277813?q=80&w=800&auto=format&fit=crop",
        description: "32oz wide mouth bottle with a few stickers on it. Left it on the second row during Chem 101.",
        reporterName: "John Doe",
        reporterContact: "john@example.com",
        reporterId: null,
        claimedAt: null,
        holderInfo: null,
        createdAt: new Date()
      },
      {
        id: "2",
        name: "Calculus Textbook",
        category: "Books",
        status: "found",
        location: "Campus Field",
        date: "May 14, 2025",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
        description: "Early Transcendentals, 8th Edition. Found on a bench near the fountain.",
        reporterName: "Jane Smith",
        reporterContact: "jane@example.com",
        reporterId: null,
        claimedAt: null,
        holderInfo: null,
        createdAt: new Date()
      },
      {
        id: "3",
        name: "Black North Face Backpack",
        category: "Bags",
        status: "lost",
        location: "Downtown",
        date: "May 16, 2025",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
        description: "Contains a laptop and gym clothes. Black with white logo.",
        reporterName: "Mike Ross",
        reporterContact: "mike@example.com",
        reporterId: null,
        claimedAt: null,
        holderInfo: null,
        createdAt: new Date()
      },
      {
        id: "4",
        name: "Car Keys",
        category: "Accessories",
        status: "found",
        location: "Adenuga building",
        date: "May 16, 2025",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800&auto=format&fit=crop",
        description: "Toyota key fob with a red lanyard.",
        reporterName: "Security Desk",
        reporterContact: "security@bells.edu",
        reporterId: null,
        claimedAt: null,
        holderInfo: null,
        createdAt: new Date()
      }
    ];

    initialItems.forEach(item => {
      this.items.set(item.id, item as any);
    });
  }


  private cleanupClaimedItems() {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    for (const [id, item] of Array.from(this.items.entries())) {
      if (item.status === "claimed" && item.claimedAt && item.claimedAt < twoDaysAgo) {
        this.items.delete(id);
      }
    }
  }


  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(gmail: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.gmail === gmail,
    );
  }

  async getUserByMatricNo(matricNo: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.matricNo === matricNo,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      department: null,
      level: null,
      phoneNumber: null,
      profileImage: null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertItem & { reporterId?: string }): Promise<Item> {
    const id = randomUUID();
    const item: Item = {
      ...insertItem,
      id,
      reporterId: insertItem.reporterId || null,
      claimedAt: null,
      holderInfo: null,
      createdAt: new Date(),
      image: insertItem.image || null,
    };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    const updatedItem = { ...item, ...updates };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async resolveItem(id: string, holderInfo: string): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    const updatedItem: Item = {
      ...item,
      status: "claimed",
      claimedAt: new Date(),
      holderInfo: holderInfo,
    };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async createNotification(insertNotif: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notif: Notification = {
      ...insertNotif,
      id,
      date: new Date(),
      read: "false",
    };
    this.notifications.set(id, notif);
    return notif;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export const storage = new MemStorage();

