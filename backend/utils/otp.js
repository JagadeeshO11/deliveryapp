import nodemailer from 'nodemailer';

const otpStore = {}; // In-memory store { email: otp }

export const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  });

  return otp;
};

export const verifyOTP = (email, otp) => {
  return otpStore[email] && otpStore[email] === otp;
};
