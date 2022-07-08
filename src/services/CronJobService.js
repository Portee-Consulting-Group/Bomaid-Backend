const cron = require('node-cron');
const OtpService = require('./OtpService');

const invalidOtpCronJob = cron.schedule("*/10 * * * *", () => {
    OtpService.invalidateOtp();
});

const deleteOtpCronJob = cron.schedule("00 00 * * *", () => { //runs at midnight
    OtpService.deleteOtp();
});

module.exports = {
    invalidOtpCronJob,
}