const UserGoalController = require('../controllers/userGoalController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  adduserGoal: 
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: cycling 
 *     required: true
 *    description:
 *     type: string
 *     example: for tracking cycles
 *     required: true
 *    userId:
 *     type: string
 *     required: true
 *    goalTypeId:
 *     type: string
 *     required: true
 *    reminderTimes:
 *     type: array
 *     items:
 *       type: string
 *     example: ["12:00", "14:00"]
 *    endDate:
 *     type: date
 *     pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
 *     example: "2022-05-17"
 *    userGoalImage:
 *     type: string
 *     format: binary  
 * 
 * 
 *  updateuserGoal: 
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
 *    userGoalImage:
 *     type: string
 *     format: binary  
 *    
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /userGoal/add:
     *  post:
     *   summary: add goal
     *   tags: 
     *    - userGoal
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/adduserGoal'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/userGoal/add', upload.single('userGoalImage'), [
        UserGoalController.addGoal
    ]);

    /**
     * @swagger
     * /userGoal/update:
     *  patch:
     *   summary: update goal
     *   tags: 
     *    - userGoal
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/updateuserGoal'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/userGoal/update', upload.single('userGoalImage'), [
        UserGoalController.updateGoal
    ]);


    /**
     * @swagger
     * /userGoal/getAll/{page}/{pageSize}:
     *  get:
     *   summary: get all types
     *   tags:  
     *     - userGoal
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
     app.get('/userGoal/getAll/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        UserGoalController.getGoals
    ]);
}
