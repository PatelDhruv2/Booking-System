// controllers/auth/authController.js
import bcrypt from 'bcrypt';
import prisma from '../config/db.config.js';
import { generateToken } from '../utils/generateToken.js';
import generateCookie from '../utils/generateCookie.js';
import { generateOtp, sendOtp } from '../utils/otp.js';
// 📌 Signup Controller
const otpStore = new Map();
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
    const c=generateCookie(res, token);
    console.log(token);
    console.log("cookie generated", c);
    const { password: _removed, ...userWithoutPassword } = user;
      const otp = generateOtp();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 minutes

    await sendOtp(email, otp);
    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: { id: user.id, email: user.email },
      token,
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
      token,
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log('Verifying OTP for email:', email);

  const entry = otpStore.get(email);
  if (!entry) {
    return res.status(400).json({ error: 'No OTP found for this email' });
  }

  const { otp: storedOtp, expiresAt } = entry;

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (otp !== storedOtp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  otpStore.delete(email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

   

    res.json({
      message: 'OTP verified successfully.',
     
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Something went wrong while verifying OTP' });
  }
};


export {

  signupController,
  loginController,
};


