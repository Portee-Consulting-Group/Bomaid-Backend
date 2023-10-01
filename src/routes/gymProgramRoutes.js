const GymProgramController = require('../controllers/gymProgramController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addGymProgram: 
 *   type: object
 *   properties:
 *    userId:
 *     type: string
 *     example: 64fee2c4583f0848196ef479 
 *    duration:
 *     type: string
 *     example: 200
 *    programDetails:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         set:
 *           type: string
 *         reps:
 *           type: integer
 *           format: int32
 *         weight:
 *           type: integer
 *           format: int32
 *         restTime:
 *           type: string
 *         exercise:
 *           type: string
 *
 *    imageUrls:
 *     type: array
 *     items:
 *       type: string
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /gym/program/add:
     *  post:
     *   summary: add gym program
     *   tags: 
     *    - gym program
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addGymProgram'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/gym/program/add', [
        GymProgramController.add
    ]);

    /**
     * @swagger
     * /gym/program/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all program for a user
     *   tags:  
     *     - gym program
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
     */
    app.get('/gym/program/:userId/:page/:pageSize', [
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        GymProgramController.getAll
    ]);
}