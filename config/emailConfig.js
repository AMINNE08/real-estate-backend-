const apiInstance = require('../config/brevoConfig');

const sendPasswordResetEmail = async (user, resetUrl) => {
  const emailData = {
    sender: { name: 'Amine', email: 'saddedineaminetahar@gmail.com' },
    to: [{ email: user.email }],
    subject: "Password Reset Request",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #BA68C8;">Hello ${user.username},</h2>
        <p style="line-height: 1.6;">
          You requested a password reset. Please click the link below to reset your password:
        </p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #BA68C8; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p style="color: #666;">
          If you did not request this, please ignore this email.
        </p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">
          Best regards, <br/> Amine
        </p>
      </div>
    `
  };

  // Send the email using Brevo API
  await apiInstance.sendTransacEmail(emailData);
};

module.exports = {
  sendPasswordResetEmail,
};
