import nodemailer from 'nodemailer';

const NODEMAILER_USER = `jx673ejxrgc3k7pb@ethereal.email`;
const NODEMAILER_PASSWORD = `2qf6uSJHMt8yDAxEGw`;

export const sendEmail = async (to: string, html: string): Promise<void> => {
  // const testAccount = await nodemailer.createTestAccount();
  // console.log(JSON.stringify(testAccount, null, 2));

  const transporter = nodemailer.createTransport({
    host: `smtp.ethereal.email`,
    port: 587,
    secure: false,
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASSWORD,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const info = await transporter.sendMail({
    from: `"Fake Reddit Account Support" <accountsupport@fakereddit.com>`,
    to,
    subject: `Hello from Fake Reddit`,
    html,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(`Message sent: %s`, info.messageId);
  console.log(`Preview URL: %s`, nodemailer.getTestMessageUrl(info));
};
