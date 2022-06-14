const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const sgMail = require('@sendgrid/mail');

async function setUpTransporter() {
    return sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    // const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    // const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    // const REFRESH_TOKEN = "1//04VTmZ1O3QiLYCgYIARAAGAQSNwF-L9IrizwVm6xzShXKdXWagzM0-jz8__UsexRP0M_8g75JVeInJ4hNqxU4P3gK-fcTD6pthZk";

    // const oAuth2Client = new google.auth.OAuth2(
    //     CLIENT_ID,
    //     CLIENT_SECRET,
    //     REDIRECT_URI
    // );
    // oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // const val = await oAuth2Client.getAccessToken();

    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         type: "OAuth2",
    //         user: "somatic20@gmail.com",
    //         clientId: CLIENT_ID,
    //         clientSecret: CLIENT_SECRET,
    //         refreshToken: REFRESH_TOKEN,
    //         accessToken: val.token,
    //     },
    // });
    // return transporter;
}


async function SendSuccessfulSignupEmail(emailObject) {
    try {
        const sgMail = await setUpTransporter();
        const msg = {
            from: process.env.SENDER_EMAIL,
            to: emailObject.email,
            subject: 'Successful sign up',
            text: `Welcome to bomaid ${emailObject.name}`
        };
        await sgMail.send(msg);
    } catch (error) {
        return error;
    }
}

async function SendRegistrationOtpEmail(otpObject) {
    try {
        const sgMail = await setUpTransporter();
        const msg = {
            from: process.env.SENDER_EMAIL,
            to: otpObject.email,
            subject: 'Confrm email',
            text: `Please use this otp to confirm email ${otpObject.otpCode}`
        };
        await sgMail.send(msg);
    } catch (error) {
        return error;
    }
}

async function SendOtpPasswordResetEmail(otpObject) {
    try {
        const sgMail = await setUpTransporter();
        const msg = {
            from: process.env.SENDER_EMAIL,
            to: otpObject.email,
            subject: 'Password reset otp',
            text: `Dear ${otpObject.name}, please use otp code: ${otpObject.otpCode} to reset password`
        };
        await sgMail.send(msg);
    } catch (error) {
        return error;
    }
}

async function supportEmail(message){
    try {
        const sgMail = await setUpTransporter();
        const msg = {
            from: process.env.SENDER_EMAIL,
            to: process.env.CUSTOMER_SUPPORT_EMAIL,
            subject: 'Bomaid customer support message',
            text: `${message}`
        };
        await sgMail.send(msg);
        
    } catch (error) {
        return error;
    }
}


async function Test() {
    try {
        const msg = {
            to: 'somatic20@gmail.com',
            from: process.env.SENDER_EMAIL,
            subject: 'Successful sign up',
            text: 'Welcome to bomaid dude'
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(msg);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    SendSuccessfulSignupEmail,
    SendRegistrationOtpEmail,
    SendOtpPasswordResetEmail,
    supportEmail,
    Test
}