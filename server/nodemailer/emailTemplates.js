export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Please Verify Your Email Address</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0;">
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #fff;">IT HireSmart</h1>
    <h2 style="color: #fff;">Verify Your Email</h2>
  </div>
  <div style="padding: 20px; background-color: #111; border-radius: 10px; max-width: 600px; margin: auto;">
    <p>Hi %%FIRST_NAME%% 👋,</p>
    <p>We’re excited to have you on board at IT HireSmart!</p>
    <p>Before you can start exploring opportunities, please verify your email by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%%VERIFICATION_URL%%"
         style="background-color: #fff;
                color: #000;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;">
        VERIFY EMAIL
      </a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn’t request this, just ignore this email.</p>
    <p>— IT HireSmart Team</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0;">
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #fff;">IT HireSmart</h1>
    <h2 style="color: #fff;">Password Reset</h2>
  </div>
  <div style="padding: 20px; background-color: #111; border-radius: 10px; max-width: 600px; margin: auto;">
    <p>Hello,</p>
    <p>Click the button below to reset your password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%%RESET_URL%%"
         style="background-color: #000;
                color: #fff;
                padding: 12px 24px;
                text-decoration: none;
                border: 1px solid #fff;
                border-radius: 5px;
                font-weight: bold;">
        RESET PASSWORD
      </a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If this wasn’t you, ignore this email.</p>
    <p>— IT HireSmart Team</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0;">
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #fff;">IT HireSmart</h1>
    <h2 style="color: #fff;">Password Reset Successful</h2>
  </div>
  <div style="padding: 20px; background-color: #111; border-radius: 10px; max-width: 600px; margin: auto;">
    <p>Hello,</p>
    <p>Your password has been successfully updated.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #fff; color: #000; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Need help? Contact our support.</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable 2FA</li>
      <li>Don’t reuse passwords</li>
    </ul>
    <p>— IT HireSmart Team</p>
  </div>
</body>
</html>
`;

export const COMPANY_VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Please Verify Your Email Address</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0;">
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #fff;">IT HireSmart</h1>
    <h2 style="color: #fff;">Verify Your Email</h2>
  </div>
  <div style="padding: 20px; background-color: #111; border-radius: 10px; max-width: 600px; margin: auto;">
    <p>Hi %%FIRST_NAME%% 👋,</p>
    <p>Thank you for registering your company with IT HireSmart.</p>
   <p>To activate your company account, please verify your company email by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%%VERIFICATION_URL%%"
         style="background-color: #fff;
                color: #000;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;">
        VERIFY EMAIL
      </a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p><strong>Note:</strong> After verifying your email, your company account must be approved by an admin before you can access all features.</p>
    <p>If you didn’t request this, just ignore this email.</p>
    <p>— IT HireSmart Team</p>
  </div>
</body>
</html>
`;