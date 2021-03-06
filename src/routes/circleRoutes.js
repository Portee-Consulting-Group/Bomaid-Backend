const CircleController = require('../controllers/circleController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addCircle:
 *   type: object
 *   properties:
 *    title:
 *     type: string
 *     example: Finance circle 
 *     required: true
 *    description:
 *     type: string
 *     example: for tracking finance cycling trips
 *     required: true
 *    theme:
 *     type: string
 *     example: blue
 *    adminId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    circleImage:
 *     type: string
 *     example: data:image/jpeg;base64   
 *    members:
 *     type: array
 *     items:
 *       type: string
 *     example: ["yuuywu", "89829929"]
 * 
 * 
 *  addMember:
 *   type: object
 *   properties:
 *    circleId:
 *     type: string
 *     example: 6292982
 *     required: true
 *    members:
 *     type: array
 *     items:
 *       type: string
 *     example: ["yuuywu", "89829929"]
 */
exports.routesConfig = function (app) {
    /**
     * @swagger
     * /circle/add:
     *  post:
     *   summary: add circle
     *   tags: 
     *    - circle
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addCircle'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/circle/add', [
        CircleController.addCircle
    ]);

    /**
     * @swagger
     * /circle/leaveCircle/{circleId}/{userId}:
     *  get:
     *   summary: remove member
     *   tags: 
     *    - circle
     *   parameters:
     *    - in: path
     *      name: circleId
     *      schema:
     *       type: string
     *      required: true
     *    - in: path
     *      name: userId
     *      schema:
     *       type: string
     *       example: 0
     *      required: true
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *  
     */
    app.get('/circle/leaveCircle/:circleId/:userId', [
        CircleController.leaveCircle
    ]);
    /**
     * @swagger
     * /circle/getUserCircles/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all user circles
     *   tags:  
     *     - circle
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
     app.get('/circle/getUserCircles/:userId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        CircleController.getUserCircles
    ]);

    /**
     * @swagger
     * /circle/getUserCircles/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get all user circles
     *   tags:  
     *     - circle
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
     app.get('/circle/getUserCircles/:userId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        CircleController.getUserCircles
    ]);

    /**
     * @swagger
     * /circle/getAdminCircles/{adminId}/{page}/{pageSize}:
     *  get:
     *   summary: get all admin circles
     *   tags:  
     *     - circle
     *   parameters:
     *    - in: path
     *      name: adminId
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
     app.get('/circle/getAdminCircles/:adminId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        CircleController.getAdminCircles
    ]);
    /**
     * @swagger
     * /circle/getAllCircles/{page}/{pageSize}:
     *  get:
     *   summary: get all circles
     *   tags:  
     *     - circle
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
     app.get('/circle/getAllCircles/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        CircleController.getAllCircles
    ]);

    /**
     * @swagger
     * /circle/getCircleMembers/{circleId}:
     *  get:
     *   summary: get all circle members
     *   tags:  
     *     - circle
     *   parameters:
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
     app.get('/circle/getCircleMembers/:circleId',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        CircleController.getMembers
    ]);

};