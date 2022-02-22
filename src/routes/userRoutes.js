const UserController = require('../controllers/userController');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  localSignUp:
 *   type: object
 *   properties:
 *    firstName:
 *     type: string
 *     example: john
 *    lastName:
 *     type: string
 *     example: doe
 *    email:
 *     type: string
 *     example: john@gmail.com
 *    callingCodeId:
 *     type: string
 *    phoneNo:
 *     type: string
 *     example: 1323242
 *    genderType:
 *     type: number
 *     example: 1
 *    userTypeId:
 *     type: string
 *    password:
 *     type: string
 *     example: 12345   
 *    confirmPassword:
 *     type: string
 *     example: 12345
 * 
 * 
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    in: header
 *    bearerFormat: JWT
 * 
 * security:
 *   - bearerAuth: []
 *    
 */

exports.routesConfig = function(app){
    /**
    * @swagger
    * /user/signup/local:
    *  post:
    *   summary: create new user
    *   tags:
    *     - user
    *   requestBody:
    *    required: true
    *    content:
    *     application/json:
    *      schema:
    *        $ref: '#/definitions/localSignUp'
    *   responses:
    *      200:
    *       description: successful response
    *      400:
    *       description: request failed
    */
    app.post('/user/signup/local', [
        UserController.addUser
    ]);

    /**
    * @swagger
    * /user/email:
    *  post:
    *   summary: testemail
    *   tags:
    *     - user
    *   responses:
    *      200:
    *       description: successful response
    *      400:
    *       description: request failed
    */
    app.post('/user/email', [
        UserController.testEmail
    ]);
}