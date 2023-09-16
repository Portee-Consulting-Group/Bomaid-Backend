const ExerciseController = require('../controllers/exerciseController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addExercise: 
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: stroke 
 *    exerciseImage:
 *     type: string
 *     example: data:image/jpeg;base64
 *    bodyId:
 *     type: array
 *     items:
 *       type: string   
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /exercise/add:
     *  post:
     *   summary: add exercise
     *   tags: 
     *    - exercise
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addExercise'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/exercise/add', [
        ExerciseController.add
    ]);/**
    * @swagger
    * /exercise/add/bodyId:
    *  post:
    *    summary: add bodyid
    *    tags: 
    *      - exercise
    *    requestBody:
    *      required: true
    *      content:
    *        application/json:
    *          schema:
    *            type: object
    *            properties:
    *              exerciseId:
    *                type: string
    *                example: 6502f32133e95df7327290d8 
    *              bodyId:
    *                type: array
    *                items:
    *                  type: string   
    *    responses:
    *      200:
    *        description: successful response
    *      400:
    *        description: request failed
    */
   
    app.post('/exercise/add/bodyId', [
        ExerciseController.addBodyId
    ]);

    /**
     * @swagger
     * /exercise/{page}/{pageSize}:
     *  get:
     *   summary: get all exercises
     *   tags:  
     *     - exercise
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
     app.get('/exercise/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        ExerciseController.getAll
    ]);
}