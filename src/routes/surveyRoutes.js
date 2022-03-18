const SurveyController = require('../controllers/surveyController');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

exports.routesConfig = function (app) {
    /**
     * @swagger
     * /survey/add:
     *  post:
     *   summary: add survey
     *   tags: 
     *    - survey
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *       type: object
     *       properties:
     *        title:
     *         type: string
     *         example: Leadership
     *         required: true
     *        questions:
     *         type: array
     *         items: 
     *          type: string
     *         example: ["Are you one?", "How does it make you feel?"]
     *         required: true
     *        userId:
     *         type: string
     *         example: 8327299
     *         required: true
     *        
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/survey/add', [
        SurveyController.addSurvey
    ]);

    /**
     * @swagger
     * /survey/getUserSurveys/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all user surveys
     *   tags:  
     *     - survey
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
     */
    app.get('/survey/getUserSurveys/:userId/:page/:pageSize', [
        SurveyController.getUserSurveys
    ]);

    /**
     * @swagger
     * /survey/getSurveys/{page}/{pageSize}:
     *  get:
     *   summary: get all surveys
     *   tags:  
     *     - survey
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
     */
    app.get('/survey/getSurveys/:page/:pageSize', [
        SurveyController.getSurveys
    ]);

    /**
     * @swagger
     * /surveyResponse/add:
     *  post:
     *   summary: add survey response
     *   tags: 
     *    - survey
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *       type: object
     *       properties:
     *        surveyId:
     *         type: string
     *         example: jhsbjhjs7
     *         required: true
     *        answers:
     *         type: array
     *         items: 
     *          type: string
     *         example: ["a", "e"]
     *         required: true
     *        userId:
     *         type: string
     *         example: 8327299
     *         required: true
     *        
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/surveyResponse/add', [
        SurveyController.addResponse
    ]);


    /**
     * @swagger
     * /survey/getUserResponses/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all user responses
     *   tags:  
     *     - survey
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
     */
    app.get('/survey/getUserResponses/:userId/:page/:pageSize', [
        SurveyController.getUserResponses
    ]);

    /**
     * @swagger
     * /survey/getAllResponses/{page}/{pageSize}:
     *  get:
     *   summary: get all responses
     *   tags:  
     *     - survey
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
     */
    app.get('/survey/getAllResponses/:page/:pageSize', [
        SurveyController.getAllResponses
    ]);
};