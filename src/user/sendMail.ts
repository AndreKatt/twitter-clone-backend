import { SentMessageInfo } from 'nodemailer';
import { transport } from '../configs/mailer.config';

interface SendEmailProps {
  emailFrom: string;
  emailTo: string;
  subject: string;
  html: string;
}

export const sendEmail = ({
  emailFrom,
  emailTo,
  subject,
  html,
}: SendEmailProps) => {
  transport.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: html,
    },
    function (err: Error | null, info: SentMessageInfo) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    },
  );
};
