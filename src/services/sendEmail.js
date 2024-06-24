import transporter from '../config/transporter.config.js';
import config from '../config/config.js';
import CustomError from '../utils/customError.js';

const sendEmail = async options => {
  try {
    const info = await transporter.sendEmail({
      from: config.SENDER_ADDRESS,
      to: options.recipient,
      subject: options.subject,
      text: options.text,
    });

    return info.messageId;
  } catch (error) {
    throw new CustomError('Failed to send email to the user', 500);
  }
};

export default sendEmail;
