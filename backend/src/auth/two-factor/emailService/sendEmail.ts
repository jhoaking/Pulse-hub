import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async sendCode(to: string, code: string) {
    const emailOptions = {
      from: `"Mi App" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Tu código de verificacion',
      html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
    };

    await this.transporter.sendMail(emailOptions);
  }
}
