const cron = require('node-cron');
const OtpService = require('./OtpService');

const invalidOtpCronJob = cron.schedule("*/10 * * * *", () => {
    OtpService.invalidateOtp();
});

module.exports = {
    invalidOtpCronJob
}