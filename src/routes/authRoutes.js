const VerifyUserMiddleware = require('../middleware/verifyUserMiddleware');
const AuthorizationController = require('../controllers/authController');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');
const passport = require('passport');

exports.routesConfig = function (app) {
    /**
     * @swagger
     * definitions:
     *  SignInModel:
     *   type: object
     *   required: true
     *   properties:
     *    email: 
     *     type: string
     *    password:
     *     type: string
     */

    /**
     * @swagger
     * /auth/local:
     *  post:
     *   summary: sign in
     *   tags:
     *     - auth
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/SignInModel'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/auth/local', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.local_login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.local_login
    ]);
    /**
     * @swagger
     * /auth/customerSupport:
     *  post:
     *   summary: sends email to customer support
     *   tags:
     *     - auth
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *       type: object
     *       properties:
     *          message: 
     *            type: string
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/auth/customerSupport', [
        AuthorizationController.sendSupportEmail
    ]);

    /**
     * @swagger
     * /auth/getOrgLevels:
     *  get:
     *   summary: get organization levels
     *   tags:  
     *     - auth
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     * 
     */
     app.get('/auth/getOrgLevels',[
        AuthorizationController.getOrganizationLevels
    ]);
    /**
     * @swagger
     * /auth/getSurveyTargets:
     *  get:
     *   summary: get survey targets
     *   tags:  
     *     - auth
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     * 
     */
    app.get('/auth/getSurveyTargets',[
        AuthorizationController.getOrganizationLevels
    ]);
    /**
     * @swagger
     * /auth/getSurveyResponse:
     *  get:
     *   summary: get survey response
     *   tags:  
     *     - auth
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     * 
     */
    app.get('/auth/getSurveyResponse',[
        AuthorizationController.getOrganizationLevels
    ]);
    
};