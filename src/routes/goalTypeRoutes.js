const GoalTypeController = require('../controllers/goalTypeController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addGoalType: 
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: cycling 
 *    description:
 *     type: string
 *     example: for tracking cycles
 *    value:
 *     type: number
 *     example: 1
 *    goalTypeImage:
 *     type: string
 *     example: data:image/jpeg;base64   
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /goalType/add:
     *  post:
     *   summary: add type
     *   tags: 
     *    - goalType
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addGoalType'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/goalType/add', [
        GoalTypeController.addGoalType
    ]);


    /**
     * @swagger
     * /goalType/getAll/{page}/{pageSize}:
     *  get:
     *   summary: get all types
     *   tags:  
     *     - goalType
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
     app.get('/goalType/getAll/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        GoalTypeController.getTypes
    ]);
}