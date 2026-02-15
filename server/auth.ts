import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, updateUserSchema } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Helper to remove password from user object
function sanitizeUser(user: SelectUser) {
    const { password, ...safeUser } = user;
    return safeUser;
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: "my_super_secret_secret_12345", // efficient for demo
        resave: false,
        saveUninitialized: false,
        store: undefined, // MemoryStore by default, fine for dev
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy({ usernameField: 'matricNo' }, async (matricNo, password, done) => {
            try {
                // Allow login with matricNo or gmail
                let user = await storage.getUserByMatricNo(matricNo);
                if (!user) {
                    user = await storage.getUserByEmail(matricNo);
                }
                if (!user || !(await comparePasswords(password, user.password))) {
                    return done(null, false, { message: "Invalid matric number/email or password" });
                } else {
                    return done(null, user);
                }
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => done(null, (user as SelectUser).id));
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // Register endpoint
    app.post("/api/register", async (req, res, next) => {
        try {
            const { password, fullName, matricNo, gmail } = req.body;

            // Validate required fields
            if (!password || !fullName || !matricNo || !gmail) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check for existing email
            const existingEmail = await storage.getUserByEmail(gmail);
            if (existingEmail) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Check for existing matric number
            const existingMatric = await storage.getUserByMatricNo(matricNo);
            if (existingMatric) {
                return res.status(400).json({ message: "Matric number already registered" });
            }

            const hashedPassword = await hashPassword(password);
            const user = await storage.createUser({
                password: hashedPassword,
                fullName,
                matricNo,
                gmail,
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(sanitizeUser(user));
            });
        } catch (err) {
            next(err);
        }
    });


    // Login endpoint
    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: SelectUser, info: any) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ message: info?.message || "Authentication failed" });
            }
            req.login(user, (err) => {
                if (err) return next(err);
                res.json(sanitizeUser(user));
            });
        })(req, res, next);
    });

    // Logout endpoint
    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    // Get current user
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(sanitizeUser(req.user as SelectUser));
    });

    // Update user profile
    app.patch("/api/user", async (req, res, next) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);

        try {
            const userId = (req.user as SelectUser).id;
            const validatedUpdates = updateUserSchema.parse(req.body);

            const updatedUser = await storage.updateUser(userId, validatedUpdates);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update session user
            req.login(updatedUser, (err) => {
                if (err) return next(err);
                res.json(sanitizeUser(updatedUser));
            });
        } catch (err) {
            next(err);
        }
    });
}
