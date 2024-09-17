import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Loaded environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req: Request, res: Response) => {
  const { email, message } = req.body;

  // Check if environment variables are loaded
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).send({ success: false, message: 'Email configuration is missing' });
  }

  // Created a transporter using your email service credentials
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Used 465 for SSL, 587 for TLS
    secure: false, // Used true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true, // Log information to console
    debug: true,  // Show SMTP traffic in console
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Test Email',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: 'Email sent successfully!' });
  } catch (error: unknown) {
    // Handled the error based on its type
    if (error instanceof Error) {
      // Handled the error as an instance of Error
      console.error('Error sending email:', error.message);
      res.status(500).send({ success: false, message: `Error sending email: ${error.message}` });
    } else {
      // Handled the case where error is not an instance of Error
      console.error('An unknown error occurred:', error);
      res.status(500).send({ success: false, message: 'An unknown error occurred' });
    }
  }
  
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
