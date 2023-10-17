const FitController = require('../controllers/fitController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addFit:
 *   type: object
 *   properties:
 *    fitValue:
 *     type: number
 *     example: 12
 *     required: true
 *    calories:
 *     type: number
 *     example: 120
 *    bpm:
 *     type: number
 *     example: 30
 *    elavation:
 *     type: number
 *     example: 12
 *    avgPace:
 *     type: number
 *     example: 3
 *    startLong:
 *     type: number
 *     example: 3
 *    endLong:
 *     type: number
 *     example: 3
 *    startLat:
 *     type: number
 *     example: 3
 *    endLat:
 *     type: number
 *     example: 3
 *    duration:
 *     type: string
 *     example: 3:10
 *    goalTypeId:
 *     type: string
 *     example: 8327299
 *     required: true
 *    challengeId:
 *     type: string
 *     example: 8327299
 *     required: true
 *    userId:
 *     type: string
 *     example: 8327299
 *     required: true
 *  
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /fit/add:
     *  post:
     *   summary: add fit
     *   tags: 
     *    - fit
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addFit'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     * 
     */
    app.post('/fit/add', [
        FitController.addFit
    ]);

    /**
     * @swagger
     * /fit/update:
     *  patch:
     *   summary: update fit
     *   tags: 
     *    - fit
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *       type: object
     *       properties:
     *        fitId:
     *         type: string
     *         example: 231232mm 
     *        fitImage:
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
    app.patch('/fit/update', [
        FitController.updateFit
    ]);

    /**
     * @swagger
     * /fit/getUserFits/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all user fits
     *   tags:  
     *     - fit
     *   parameters:
     *    - in: path
     *      name: userId
     *      schema:
     *       type: string
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
    app.get('/fit/getUserFits/:userId/:page/:pageSize', [
        FitController.getFits
    ]);

    /**
     * @swagger
     * /fit/getAllFits/{page}/{pageSize}:
     *  get:
     *   summary: get all  fits
     *   tags:  
     *     - fit
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
     app.get('/fit/getAllFits/:page/:pageSize', [
        FitController.getAllFits
    ]);
    /**
     * @swagger
     * /fit/getAllFitsByGoalType/{goalTypeId}/{page}/{pageSize}:
     *  get:
     *   summary: get all fits by goal type
     *   tags:  
     *     - fit
     *   parameters:
     *    - in: path
     *      name: goalTypeId
     *      schema:
     *       type: string
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
    app.get('/fit/getAllFitsByGoalType/:goalTypeId/:page/:pageSize', [
        FitController.getAllFitsByGoalType
    ]);

    /**
     * @swagger
     * /fit/getFitStatistics/{userId}:
     *  get:
     *   summary: get fit  statistic
     *   tags:  
     *     - fit
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
     */
    app.get('/fit/getFitStatistics/:userId', [
        FitController.getFitStatistics
    ]);

    /**
     * @swagger
     * /fit/getFitSumByDateRange:
     *  get:
     *   summary: get fit sum by date range 
     *   tags:  
     *     - fit
     *   parameters:
     *    - in: query
     *      name: startDate
     *      schema:
     *       type: string
     *      required: true
     *    - in: query
     *      name: endDate
     *      schema:
     *       type: string
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     */
    app.get('/fit/getFitSumByDateRange', [
        FitController.getFitSumByDateRange
    ]);
};