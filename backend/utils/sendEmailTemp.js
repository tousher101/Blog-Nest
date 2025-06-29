const signupConfirmTemp = (name, verificationLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome, ${name}!</h2>
    <p>Thank you for signing up Blog-Nest World. Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}" style="background-color: #4CAF50; padding: 10px 20px; color: white; text-decoration: none;">Verify Email</a>
    <p>If you didn't create this account, you can ignore this email.</p>
  </div>
`;
module.exports = signupConfirmTemp