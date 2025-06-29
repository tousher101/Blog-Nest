const resetPasswordTemplate = (name, resetLink) => {
  return `
    <div style="font-family:Arial;">
      <h2>Hello ${name},</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it (valid for 15 minutes):</p>
      <a href="${resetLink}">Reset Password</a>
    </div>
  `;
};

module.exports = resetPasswordTemplate;