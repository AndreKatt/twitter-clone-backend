import * as nodemailer from 'nodemailer';
import config from 'dotenv/config';

config;

const getOptions = {
  host: process.env.NODEMAILER_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.NODEMAILER_PORT) || 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
};

export const transport = nodemailer.createTransport(getOptions);
