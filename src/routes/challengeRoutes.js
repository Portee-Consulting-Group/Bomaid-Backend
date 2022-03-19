const ChallengeController = require('../controllers/challengeController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addChallenge:
 *   type: object
 *   properties:
 *    title:
 *     type: string
 *     example: Run 10 km
 *     required: true
 *    description:
 *     type: string
 *     example: lets see how fast you run
 *     required: true
 *    challengeImage:
 *     type: string
 *     format: binary  
 *     required: true
 *    goalTypeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    challengeTarget:
 *     type: Number
 *     example: 10
 *     required: true
 * 
 *  updateChallenge:
 *   type: object
 *   properties:
 *    challengeId:
 *     type: string
 *     example: u33hub
 *     required: true
 *    title:
 *     type: string
 *     example: Run 10 km
 *     required: true
 *    description:
 *     type: string
 *     example: lets see how fast you run
 *     required: true
 *    challengeImage:
 *     type: string
 *     format: binary  
 *    challengeTarget:
 *     type: Number
 *     example: 10
 *     required: true
 * 
 *  addCircleChallenge:
 *   type: object
 *   properties:
 *    results:
 *     type: array
 *     items: object
 *    endTime:
 *     type: string
 *     example: 22:00
 *    endDate:
 *     type: date
 *     example: lets see how fast you run
 *    challengeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    circleId:
 *     type: string
 *     example: 6292982
 *     required: true
 * 
 * 
 */


 exports.routesConfig = function (app) {
    /**
     * @swagger
     * /challenge/add:
     *  post:
     *   summary: add challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/addChallenge'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/challenge/add', upload.single('challengeImage'), [
       ChallengeController.addChallenge
    ]);

    /**
     * @swagger
     * /challenge/update:
     *  patch:
     *   summary: update challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/updateChallenge'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/challenge/update', upload.single('challengeImage'), [
       ChallengeController.updateChallenges
    ]);


    /**
     * @swagger
     * /challenge/getChallenges/{page}/{pageSize}:
     *  get:
     *   summary: get all challenges
     *   tags:  
     *     - challenge
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
     app.get('/challenge/getChallenges/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        ChallengeController.getChallenges
    ]);

    /**
     * @swagger
     * /circlechallenge/add:
     *  post:
     *   summary: add challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/addCircleChallenge'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/circlechallenge/add', [
       ChallengeController.addCircleChallenge
    ]);



    /**
     * @swagger
     * /circlechallenge/udateMember:
     *  patch:
     *   summary: update circle challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     multipart/form-data:
     *      schema:
     *        $ref: '#/definitions/updateChallenge'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/circlechallenge/udateMember', [
       ChallengeController.updateMemberData
    ]);


    /**
     * @swagger
     * /circlechallenge/getCircleChallenges/{circleId}/{page}/{pageSize}:
     *  get:
     *   summary: get all circle challenges
     *   tags:  
     *     - challenge
     *   parameters:
     *    - in: path
     *      name: circleId
     *      schema:
     *       type: string
     *       example: 363ghe
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
     app.get('/circlechallenge/getCircleChallenges/:circleId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        ChallengeController.getCircleChallenges
    ]);
 }