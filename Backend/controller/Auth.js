// controllers/auth/authController.js
import bcrypt from 'bcrypt';
import prisma from '../config/db.config.js';
import { generateToken } from '../utils/generateToken.js';
import generateCookie from '../utils/generateCookie.js';

// 📌 Signup Controller
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(user.id);
    generateCookie(res, token);

    const { password: _removed, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Signup successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 📌 Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    generateCookie(res, token);

    const { password: _removed, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Export both
export {
  signupController,
  loginController,
};
