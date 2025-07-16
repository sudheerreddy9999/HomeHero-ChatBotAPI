"use strict";

const EmailTemplates = {
  REGISTRATION_TEMPLATE: (name) => {
    return {
      subject: "Welcome to HomeHero! Your Trusted Local Service Partner",
      body: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to HomeHero</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f2f6f7;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border:1px solid rgba(30, 30, 30, 0.05);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 18px rgba(0, 0, 0,0);
      }

      .email-header {
        background-color: #53c9c2;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }

      .email-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }

      .email-body {
        padding: 30px 25px;
        color: #333333;
      }

      .email-body p {
        line-height: 1.6;
        margin-bottom: 20px;
        font-size: 16px;
      }

      .email-button {
        display: block;
        width: fit-content;
        margin: 0 auto;
        background-color: #53c9c2;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
      }

      .email-footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Welcome to HomeHero 🏠</h1>
      </div>
      <div class="email-body">
        <p>Hi ${name},</p>
        <p>Thank you for joining <strong>HomeHero</strong> — we're excited to help you connect with trusted local professionals who are ready to assist you when you need it most.</p>
        <p>Whether it's for your home, your car, or anything in between, HomeHero is here to simplify your life with reliable service at your fingertips.</p>
        <p style="text-align: center;">
          <a class="email-button" href="https://your-homehero-url.com/login">Get Started</a>
        </p>
        <p>If you have any questions, our team is always here to support you.</p>
        <p>Cheers,<br />The HomeHero Team</p>
      </div>
      <div class="email-footer">
        © 2025 HomeHero. All rights reserved.
      </div>
    </div>
  </body>
</html>
`,
    };
  },
  OTP_TEMPLATE: (name, otp) => {
    return {
      subject: "Your HomeHero Verification Code",
      body: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your OTP Code</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f2f6f7;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
  
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border: 1px solid rgba(30, 30, 30, 0.05);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 18px rgba(0, 0, 0, 0);
        }
  
        .email-header {
          background-color: #53c9c2;
          color: #ffffff;
          text-align: center;
          padding: 30px 20px;
        }
  
        .email-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
  
        .email-body {
          padding: 30px 25px;
          color: #333333;
        }
  
        .email-body p {
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 16px;
        }
  
        .otp-code {
          display: inline-block;
          background-color: #f0f0f0;
          color: #333333;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          margin: 20px 0;
        }
  
        .email-footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Your HomeHero Verification Code 🔒</h1>
        </div>
        <div class="email-body">
          <p>Hi ${name},</p>
          <p>Welcome to HomeHero, we're thrilled to have you onboard! To complete your registration and start exploring trusted local services, please enter the one-time password (OTP) below:</p>
          <p style="text-align: center;">
            <span class="otp-code">${otp}</span>
          </p>
          <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
          <p>If you didn’t request this code, please ignore this email.</p>
          <p>Cheers,<br />The HomeHero Team</p>
        </div>
        <div class="email-footer">
          © 2025 HomeHero. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `,
    };
  },
};

export default EmailTemplates;
