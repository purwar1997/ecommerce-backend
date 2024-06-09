import transporter from '../config/transporter.config.js';
import config from '../config/config.js';

const sendMail = async options => {
  const info = await transporter.sendMail({
    from: config.SENDER_ADDRESS,
    to: options.recipient,
    subject: options.subject,
    text: options.text,
  });

  return info.messageId;
};

export default sendMail;
