const UserController = require('../controllers/userController');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');
const upload = require('../common/multer');

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
 *     example: john@bomaid.co.bw
 *    genderType:
 *     type: number
 *     example: 1
 *    dateOfBirth:
 *     type: date
 *     pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *     example: "2022-05-17"
 *    companyRole:
 *     type: string
 *     example: Head of product
 *    accountType:
 *     type: number
 *     example: 1
 *    orgLevel:
 *     type: number
 *     example: 1
 *    profileImage:
 *     type: string
 *     example: data:image/jpeg;base64
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

exports.routesConfig = function (app) {
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
     * /user/update:
     *  patch:
     *   summary: update user
     *   tags:
     *     - user
     *   requestBody:
     *    content:
     *     application/json:
     *      schema: 
     *       type: object
     *       properties:
     *        id:
     *         type: string
     *        firstName:
     *         type: string
     *        lastName:
     *         type: string
     *        companyRole:
     *         type: string
     *        level:
     *         type: number
     *        profileImage:
     *         type: string
     *         example: data:image/jpeg;base64  
     *  
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *   
     */
    app.patch('/user/update', [
        // AuthValidationMiddleware.validJWTNeeded,
        UserController.updateUser
    ]);

    /**
     * @swagger
     * /user/getUser/{email}:
     *  get:
     *   summary: get user details
     *   tags:  
     *     - user
     *   parameters:
     *    - in: path
     *      name: email
     *      schema:
     *       type: string
     *       example: user@bomaid.co.bw
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     * 
     */
    app.get('/user/getUser/:email', [
        UserController.getUser
    ]);

    /**
     * @swagger
     * /user/getUserById/{userId}:
     *  get:
     *   summary: get user details by id
     *   tags:  
     *     - user
     *   parameters:
     *    - in: path
     *      name: userId
     *      schema:
     *       type: string
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     * 
     */
    app.get('/user/getUserById/:userId', [
        UserController.getUserById
    ]);


    /**
     * @swagger
     * /user/getAll/{page}/{pageSize}:
     *  get:
     *   summary: get all users
     *   tags:  
     *     - user
     *   parameters:
     *    - in: path
     *      name: page
     *      schema:
     *       type: number
     *       example: 0
     *      required: true
     *    - in: path
     *      name: pageSize
     *      schema:
     *       type: number
     *       example: 10
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     */
     app.get('/user/getAll/:page/:pageSize', [
        UserController.getUsers
    ]);
    /**
     * @swagger
     * /user/getAllByLevel/{level}/{page}/{pageSize}:
     *  get:
     *   summary: get all users by level
     *   tags:  
     *     - user
     *   parameters:
     *    - in: path
     *      name: level
     *      schema:
     *       type: number
     *       example: 1
     *      required: true
     *    - in: path
     *      name: page
     *      schema:
     *       type: number
     *       example: 0
     *      required: true
     *    - in: path
     *      name: pageSize
     *      schema:
     *       type: number
     *       example: 10
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     */
    app.get('/user/getAllByLevel/:level/:page/:pageSize', [
        UserController.getUsers
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