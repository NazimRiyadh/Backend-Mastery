const appName = process.env.APP_NAME || "Authentication App";

// Shared font stack — must be repeated inline for email client compatibility
const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * OTP verification email
 * Industry-standard: fully inline styles, table-based layout, MSO conditionals
 */
export const getOtpHtml = ({ email, otp }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${appName} – Verification Code</title>
  <!--[if !mso]><!-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .content-padding { padding: 24px !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 6px !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:${fontFamily}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!--[if mso]>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td>
        <![endif]-->

        <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111827; padding:20px 24px;">
              <span style="color:#ffffff; font-family:${fontFamily}; font-size:18px; font-weight:700; letter-spacing:0.3px;">${appName}</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding:32px 32px 24px 32px;">
              <h1 style="margin:0 0 12px 0; font-family:${fontFamily}; font-size:22px; line-height:1.3; color:#111827; font-weight:700;">Verify your email</h1>
              <p style="margin:0 0 8px 0; font-family:${fontFamily}; font-size:15px; line-height:1.6; color:#374151;">
                Hi <strong>${email}</strong>,
              </p>
              <p style="margin:0 0 24px 0; font-family:${fontFamily}; font-size:15px; line-height:1.6; color:#374151;">
                Use the verification code below to complete your sign-in to ${appName}.
              </p>

              <!-- OTP Code -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="otp-code" style="background-color:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; padding:16px 24px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:32px; font-weight:700; letter-spacing:10px; color:#111827; text-align:center;">
                          ${otp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-family:${fontFamily}; font-size:14px; line-height:1.6; color:#6b7280;">
                This code will expire in <strong>5 minutes</strong>.
              </p>
              <p style="margin:0; font-family:${fontFamily}; font-size:14px; line-height:1.6; color:#6b7280;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="border-top:1px solid #e5e7eb; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 24px 28px 24px;">
              <p style="margin:0; font-family:${fontFamily}; font-size:12px; line-height:1.6; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!--[if mso]>
        </td></tr></table>
        <![endif]-->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

/**
 * Account verification (link-based) email
 * Industry-standard: fully inline styles, table-based layout, MSO conditionals,
 * bulletproof button using padding + VML fallback
 */
export const getVerifyEmailHtml = ({ email, token }) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${appName} – Verify Your Account</title>
  <!--[if !mso]><!-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .content-padding { padding: 24px !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:${fontFamily}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!--[if mso]>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td>
        <![endif]-->

        <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111827; padding:20px 24px;">
              <span style="color:#ffffff; font-family:${fontFamily}; font-size:18px; font-weight:700; letter-spacing:0.3px;">${appName}</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding:32px 32px 24px 32px;">
              <h1 style="margin:0 0 12px 0; font-family:${fontFamily}; font-size:22px; line-height:1.3; color:#111827; font-weight:700;">Verify your account</h1>
              <p style="margin:0 0 8px 0; font-family:${fontFamily}; font-size:15px; line-height:1.6; color:#374151;">
                Hi <strong>${email}</strong>,
              </p>
              <p style="margin:0 0 24px 0; font-family:${fontFamily}; font-size:15px; line-height:1.6; color:#374151;">
                Thanks for registering with ${appName}. Click the button below to verify your account.
              </p>

              <!-- Bulletproof Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px 0;">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#111827;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verifyUrl}" style="height:44px;v-text-anchor:middle;width:180px;" arcsize="18%" strokecolor="#111827" fillcolor="#111827">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:${fontFamily};font-size:14px;font-weight:600;">Verify account</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${verifyUrl}" target="_blank" rel="noopener" style="display:inline-block; background-color:#111827; color:#ffffff; font-family:${fontFamily}; font-size:14px; font-weight:600; text-decoration:none; padding:12px 28px; border-radius:8px; line-height:1.2;">Verify account</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-family:${fontFamily}; font-size:14px; line-height:1.6; color:#6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 16px 0; font-family:${fontFamily}; font-size:14px; line-height:1.6; color:#6b7280;">
                <a href="${verifyUrl}" target="_blank" rel="noopener" style="color:#111827; text-decoration:underline; word-break:break-all;">${verifyUrl}</a>
              </p>
              <p style="margin:0; font-family:${fontFamily}; font-size:14px; line-height:1.6; color:#6b7280;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="border-top:1px solid #e5e7eb; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 24px 28px 24px;">
              <p style="margin:0; font-family:${fontFamily}; font-size:12px; line-height:1.6; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!--[if mso]>
        </td></tr></table>
        <![endif]-->

      </td>
    </tr>
  </table>

</body>
</html>`;
};
