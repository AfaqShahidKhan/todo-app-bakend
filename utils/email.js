const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Afaq Shahid <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async sendMail(subject, text) {
    const transporter = this.createTransport();

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: text,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }
  }

  async sendWelcome() {
    const subject = "Welcome to the TODO App!";
    const text = `Hello ${this.firstName},\n\nWelcome to the TODO app! We're glad to have you on board.`;
    await this.sendMail(subject, text);
  }

  async sendRecurringNotification() {
    const subject = "Task Repeat again from the TODO App!";
    const text = `Hi ${this.firstName},\n\nThis is a friendly reminder from the TODO app that your task is again Created. Stay productive and accomplish your goals!`;
    await this.sendMail(subject, text);
  }

  async sendReminderNotification() {
    const subject = "Task Reminder from the TODO App!";
    const text = `Hi ${this.firstName},\n\nThis is a friendly reminder from the TODO app to keep you on track with your tasks. Stay productive and accomplish your goals!`;
    await this.sendMail(subject, text);
  }

  async sendPasswordReset() {
    const subject = "Password Reset Request";
    const text = `Hello ${this.firstName},\n\nYou requested a password reset. Click on the following link to reset your password: ${this.url}`;
    await this.sendMail(subject, text);
  }
};
