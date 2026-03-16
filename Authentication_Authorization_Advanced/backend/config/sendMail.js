import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
