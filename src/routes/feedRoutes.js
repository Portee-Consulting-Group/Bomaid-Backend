const FeedController = require('../controllers/feedController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addFeed: 
 *   type: object
 *   properties:
 *    username:
 *     type: string
 *     example: name 
 *    goalName:
 *     type: string
 *     example: walking
 *    userId:
 *     type: string
 *     example: ftyjju
 *    feedImage:
 *     type: string
 *     example: data:image/jpeg;base64   
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /feed/add:
     *  post:
     *   summary: add feed
     *   tags: 
     *    - feed
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addFeed'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/feed/add', [
        FeedController.addFeed
    ]);

    /**
     * @swagger
     * /feed/likeFeed/{feedId}/{like}:
     *  get:
     *   summary: lik feed
     *   tags:  
     *     - feed
     *   parameters:
     *    - in: path
     *      name: feedId
     *      schema:
     *       type: string
     *       example: jhsjs
     *      required: true
     *    - in: path
     *      name: like
     *      schema:
     *       type: boolean
     *       example: true
     *      required: true
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     *    
     */
    app.get('/feed/likeFeed/:feedId/:like',[
        FeedController.likeFeed
    ]);


    /**
     * @swagger
     * /feed/getUserFeeds/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get user feeds
     *   tags:  
     *     - feed
     *   parameters:
     *    - in: path
     *      name: userId
     *      schema:
     *       type: string
     *       example: jnksjns
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
     app.get('/feed/getUserFeeds/:userId/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        FeedController.getUserFeeds
    ]);
    /**
     * @swagger
     * /feed/getAll/{page}/{pageSize}:
     *  get:
     *   summary: get all feeds
     *   tags:  
     *     - feed
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
     app.get('/feed/getAll/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        FeedController.getFeeds
    ]);
}