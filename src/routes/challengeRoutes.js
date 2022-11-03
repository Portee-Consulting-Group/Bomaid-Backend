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
 *    info:
 *     type: string
 *     example: Info about challenge
 *     required: true
 *    challengeImage:
 *     type: string
 *     example: data:image/jpeg;base64  
 *     required: true
 *    goalTypeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    challengeTarget:
 *     type: Number
 *     example: 10
 *     required: true
 *    endDate:
 *     type: date
 *     example: 2022-05-17
 * 
 *  adduserchallenge:
 *   type: object
 *   properties:
 *    challengeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    goalTypeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    userId:
 *     type: string
 *     example: 6292982
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
 *     example: data:image/jpeg;base64  
 *    challengeTarget:
 *     type: Number
 *     example: 10
 *     required: true
 * 
 *  addCircleChallenge:
 *   type: object
 *   properties:
 *    endTime:
 *     type: string
 *     example: 22:00
 *    endDate:
 *     type: date
 *     example: 2022-05-17
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
 *  updateMemberData:
 *   type: object
 *   properties:
 *    circleChallengeId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    results:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *        userId:
 *         type: string
 *         example: 133
 *         required: true
 *        value:
 *         type: string
 *         example: 133
 *         required: true
 *     example:
 *      - userId: "232332"
 *        value: 12
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
     *     application/json:
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
    app.post('/challenge/add', [
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
     *     application/json:
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
   * /challenge/getChallengeByGoalType/{goalTypeId}/{page}/{pageSize}:
   *  get:
   *   summary: get all challenges by goal type
   *   tags:  
   *     - challenge
   *   parameters:
   *    - in: path
   *      name: goalTypeId
   *      schema:
   *       type: string
   *       example: fddfd
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
   app.get('/challenge/getChallengeByGoalType/:goalTypeId/:page/:pageSize',[
      // AuthValidationMiddleware.validJWTNeeded,
      // AuthPermissionMiddleware.adminLevelRequired,
      ChallengeController.getChallengeByGoalType
  ]);

    /**
     * @swagger
     * /circlechallenge/add:
     *  post:
     *   summary: add circle challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
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
     * /userchallenge/add:
     *  post:
     *   summary: add user challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/adduserchallenge'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
     app.post('/userchallenge/add', [
      ChallengeController.addUserChallenge
   ]);



    /**
     * @swagger
     * /circlechallenge/updateMember:
     *  patch:
     *   summary: update circle challenge
     *   tags: 
     *    - challenge
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/updateMemberData'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/circlechallenge/updateMember', [
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

    /**
     * @swagger
     * /challenge/getCircleRanking/{challengeId}:
     *  get:
     *   summary: get all circle ranks in a challenge
     *   tags:  
     *     - challenge
     *   parameters:
     *    - in: path
     *      name: challengeId
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
     app.get('/challenge/getCircleRanking/:challengeId',[
      // AuthValidationMiddleware.validJWTNeeded,
      // AuthPermissionMiddleware.adminLevelRequired,
      ChallengeController.getCircleRanks
  ]);

    /**
     * @swagger
     * /challenge/getCircleRanksByGoalTypeId/{goalTypeId}:
     *  get:
     *   summary: get all circle ranks in a challenge by goal type id
     *   tags:  
     *     - challenge
     *   parameters:
     *    - in: path
     *      name: goalTypeId
     *      schema:
     *       type: string
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
     app.get('/challenge/getCircleRanksByGoalTypeId/:goalTypeId',[
      // AuthValidationMiddleware.validJWTNeeded,
      // AuthPermissionMiddleware.adminLevelRequired,
      ChallengeController.getCircleRanksByGoalTypeId
  ]);

  /**
   * @swagger
   * /challenge/getIndividualFitData/{circleId}/{goalTypeId}/{challengeId}:
   *  get:
   *   summary: get all individual fit data by circleId and goalTypeId
   *   tags:  
   *     - challenge
   *   parameters:
   *    - in: path
   *      name: goalTypeId
   *      schema:
   *       type: string
   *      required: true
   *    - in: path
   *      name: challengeId
   *      schema:
   *       type: string
   *      required: true
   *    - in: path
   *      name: circleId
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
   app.get('/challenge/getIndividualFitData/:circleId/:goalTypeId/:challengeId',[
      // AuthValidationMiddleware.validJWTNeeded,
      // AuthPermissionMiddleware.adminLevelRequired,
      ChallengeController.getIndividualFitData
  ]);

  /**
   * @swagger
   * /challenge/getIndividualFitDataByGoalTypeId/{goalTypeId}:
   *  get:
   *   summary: get individual fit data by goal type
   *   tags:  
   *     - challenge
   *   parameters:
   *    - in: path
   *      name: goalTypeId
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
   app.get('/challenge/getIndividualFitDataByGoalTypeId/:goalTypeId',[
      // AuthValidationMiddleware.validJWTNeeded,
      // AuthPermissionMiddleware.adminLevelRequired,
      ChallengeController.getIndividualFitDataByGoalTypeId
  ]);
 }