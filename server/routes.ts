import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.get("/api/items", async (req, res) => {
    const items = await storage.getItems();
    res.json(items);
  });

  app.post("/api/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const itemData = req.body;
      const item = await storage.createItem({
        ...itemData,
        reporterId: (req.user as any).id,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const item = await storage.updateItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  });

  app.delete("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const success = await storage.deleteItem(req.params.id);
    if (!success) return res.status(404).json({ message: "Item not found" });
    res.sendStatus(200);
  });

  app.post("/api/items/:id/resolve", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { holderInfo } = req.body;
    const item = await storage.resolveItem(req.params.id, holderInfo);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  });

  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const notifs = await storage.getNotifications((req.user as any).id);
    res.json(notifs);
  });

  app.post("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const notif = await storage.createNotification(req.body);
      res.status(201).json(notif);
    } catch (err) {
      res.status(400).json({ message: "Invalid notification data" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const success = await storage.deleteNotification(req.params.id);
    if (!success) return res.status(404).json({ message: "Notification not found" });
    res.sendStatus(200);
  });

  return httpServer;
}

