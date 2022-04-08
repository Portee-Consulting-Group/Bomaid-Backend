const MessagingController = require('../controllers/messagingController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  sendMessage:
 *   type: object
 *   properties: 
 *    chatId:
 *     type: string
 *    senderId:
 *     type: string
 *    receiverId:
 *     type: string
 *    text:
 *     type: string
 *    file:
 *     type: array
 *     items:
 *       type: string
 * 
 *  createGroupChat:
 *   type: object
 *   properties: 
 *    title:
 *     type: string
 *    userId:
 *     type: array
 *     items:
 *       type: string
 */
exports.routesConfig = function (app){
    /**
     * @swagger
     * /chat/createGroup:
     *  post:
     *   summary: create group
     *   tags: 
     *    - chat
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/createGroupChat'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/chat/createGroup', [
        MessagingController.createGroup
    ]);

    /**
     * @swagger
     * /chat/sendMessage:
     *  post:
     *   summary: send chat
     *   tags: 
     *    - chat
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/sendMessage'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     * 
     */
    app.post('/chat/sendMessage', [
        MessagingController.sendMessage
    ])
};