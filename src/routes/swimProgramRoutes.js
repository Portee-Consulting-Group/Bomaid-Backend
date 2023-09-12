const SwimProgramController = require('../controllers/swimProgramController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addProgram: 
 *   type: object
 *   properties:
 *    userId:
 *     type: string
 *     example: 64fee2c4583f0848196ef479 
 *    styleId:
 *     type: string
 *     example: 64fee2c4583f0848196ef479 
 *    duration:
 *     type: string
 *     example: 2h 2mins 
 *    laps:
 *     type: number
 *     example: 0 
 *    speed:
 *     type: number
 *     example: 0 
 *    poolSize:
 *     type: number
 *     example: 0 
 *    calories:
 *     type: number
 *     example: 0 
 *    heartRate:
 *     type: number
 *     example: 0 
 *    pace:
 *     type: number
 *     example: 0 
 *    distance:
 *     type: number
 *     example: 0 
 *    imageUrls:
 *     type: array
 *     items:
 *       type: string
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /swim/program/add:
     *  post:
     *   summary: add swim program
     *   tags: 
     *    - swim program
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addProgram'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/swim/program/add', [
        SwimProgramController.addProgram
    ]);

    /**
     * @swagger
     * /swim/program/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all program for a user
     *   tags:  
     *     - swim program
     *   parameters:
     *    - in: path
     *      name: userId
     *      schema:
     *       type: string
     *       example: 64fee2c4583f0848196ef479
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
     app.get('/swim/program/:userId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        SwimProgramController.getUserProgram
    ]);
}