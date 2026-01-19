const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../Database/Models/user");
const authMiddleware = require("./middlewares");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_here";

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });
  await newUser.save();
  res.status(201).json({ message: "User created" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid password" });

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.json({
    message: "Logged in successfully",
    user: { id: user._id, name: user.name, role: user.role, email: user.email },
  });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.post("/register", async (req, res) => {
  try {
    const { businessName, phone , id } = req.body;

    if (!businessName || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "manager") {
      return res.status(400).json({ message: "User is already a manager" });
    }

    user.role = "manager";
    user.managerData = {
      businessName,
      phone,
      verified: false,
      appliedAt: new Date(),
    };

    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      message: "Manager registration successful. Await approval.",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Manager registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});



module.exports = router;
