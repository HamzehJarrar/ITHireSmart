import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { transporter } from "./nodemailer.config.js";

const sender = `"ITHireSmart" <${process.env.SMTP_USER}>`;

export const sendVerificationEmail = async (firstName,email, verificationURL) => {
    try {
        const personalizedHTML = VERIFICATION_EMAIL_TEMPLATE
            .replace(/%%VERIFICATION_URL%%/g, verificationURL)
            .replace(/%%FIRST_NAME%%/g, firstName);
        
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify your email",
            html: personalizedHTML,
        });
    } catch (error) {
        console.error("failed to send verification email:", error);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/%%RESET_URL%%/g, resetURL),
        });
    } catch (error) {
        console.error("failed to send password reset email:", error);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
    } catch (error) {
        console.error("failed to send password reset success email:", error);
    }
};
