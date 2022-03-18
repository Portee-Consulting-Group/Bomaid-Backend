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
 *    goalTypeId:
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
     *     multipart/form-data:
     *      schema:
     *       type: object
     *       properties:
     *        fitId:
     *         type: string
     *         example: 231232mm 
     *        fitImage:
     *         type: string
     *         format: binary  
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
    app.patch('/fit/update', upload.single('fitImage'), [
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
};