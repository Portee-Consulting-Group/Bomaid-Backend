
const OtpController = require('../controllers/otpController');

/**
 * @swagger
 * definitions:
 *  verifyPasswordResetOtpModel:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *    code:
 *     type: string
 *    password:
 *     type: string
 *    confirmPassword:
 *     type: string
 *  verifyRegistrationOtpModel:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *    code:
 *     type: string
 */
exports.routesConfig = function (app) {
    /**
    * @swagger
    * /otp/sendRegistrationOtp/{email}:
    *  get:
    *   summary: Send otp to registered email
    *   tags: 
    *     - otp
    *   parameters:
    *    - in: path
    *      name: email
    *      schema:
    *       type: string
    *      required: true
    *   responses:
    *      200:
    *       description: successful response
    *      400:
    *       description: request failed
     */
    app.get('/otp/sendRegistrationOtp/:email', OtpController.sendRegistrationOtpCode);

    
    /**
    * @swagger
    * /otp/sendPasswordResetOtp/{email}:
    *  get:
    *   summary: Send otp to reset password
    *   tags: 
    *     - otp
    *   parameters:
    *    - in: path
    *      name: email
    *      schema:
    *       type: string
    *      required: true
    *   responses:
    *      200:
    *       description: successful response
    *      400:
    *       description: request failed
    */
     app.get('/otp/sendPasswordResetOtp/:email', OtpController.sendPasswordResetCode);

    /**
     * @swagger
     * /otp/verifyPasswordResetOtp:
     *  post:
     *   summary: verify password reset
     *   tags:
     *     - otp
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/verifyPasswordResetOtpModel'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     * 
     */
    app.post('/otp/verifyPasswordResetOtp', OtpController.verifyPasswordResetOtp);


    /**
     * @swagger
     * /otp/verifyRegistrationOtp:
     *  post:
     *   summary: verify email confirmation
     *   tags:
     *     - otp
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/verifyRegistrationOtpModel'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     * 
     */
    app.post('/otp/verifyRegistrationOtp', OtpController.verifyEmailConfirmationOtp);
}