const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSPORT
    }
});


async function SendSuccessfulSignupEmail(emailObject) {
    const mailOptions = {
        from: process.env.EMAIL_HEADER,
        to: emailObject.email,
        subject: 'Successful sign up',
        text: `Welcome to spaces ${emailObject.name}`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }

    });
}

async function SendRegistrationOtpEmail(otpObject) {
    const mailOptions = {
        from: process.env.EMAIL_HEADER,
        to: otpObject.email,
        subject: 'Confrm email',
        text: `Please use this otp to confirm email ${otpObject.otpCode}`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


async function SendOtpConfirmationEmail(otpObject) {
    const mailOptions = {
        from: process.env.EMAIL_HEADER,
        to: otpObject.email,
        subject: 'Email confirmed',
        text: `Welcome to spaces ${otpObject.name}`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


async function SendOtpPasswordResetEmail(otpObject) {
    console.log('otp object', otpObject);
    const mailOptions = {
        from: process.env.EMAIL_HEADER,
        to: otpObject.email,
        subject: 'Password reset otp',
        text: `Dear ${otpObject.name}, please use otp code: ${otpObject.otpCode} to reset password`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function SendEmailToAddPlaylistContributor(emailObject) {
    const mailOptions = {
        from: process.env.EMAIL_HEADER,
        to: emailObject.contributorEmail,
        subject: 'Confirm request to be a contributor',
        text: `Dear ${emailObject.contributorUsername}, ${emailObject.senderUsername} has sent you an invitation to join their playlist ${emailObject.playlistName}. \nPlease accept it by clicking this: ${emailObject.requestLink}`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



async function Test() {
    console.log(`${process.env.MAIL_EMAIL}, ${process.env.MAIL_PASSPORT} `)
    const mailOptions = {
        from: 'Spaces',
        to: 'somatic20@gmail.com',
        subject: 'Successful sign up',
        text: `Welcome to spaces dude`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    // transporter.close();
}

module.exports = {
    SendSuccessfulSignupEmail,
    SendOtpConfirmationEmail,
    SendRegistrationOtpEmail,
    SendOtpPasswordResetEmail,
    SendEmailToAddPlaylistContributor,
    Test
}