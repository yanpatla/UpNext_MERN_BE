import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, name, token } = data;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Info Email

  const info = await transport.sendMail({
    from: '"UpTask - Project Mangment" <account@uptask.com>',
    to: email,
    subject: "UpTask - Confirm your account",
    text: "Confirm your Account in UpTask",
    html: `<p>Hi ${name} Confirm your Account in UpTask</p>
    <p>Your Account is almost ready, just check it on the following link: </p>
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>
    <p>If you did not create this account you may read this message</p>
    `,
  });
};
export const emailForgotPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Info Email

  const info = await transport.sendMail({
    from: '"UpTask - Project Mangment" <account@uptask.com>',
    to: email,
    subject: "UpTask - reset your password",
    text: "reset your password in UpTask",
    html: `<p>Hi ${name} reset your password in UpTask</p>
    <p>Click on the following link to reset your new password: <p>
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset Password</a>
    <p>If you did not request a password reset, ignore this message</p>
    `,
  });
};
