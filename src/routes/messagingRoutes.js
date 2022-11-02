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
 *     type: string
 *     example: data:image/jpeg;base64
 * 
 *  createGroupChat:
 *   type: object
 *   properties: 
 *    title:
 *     type: string
 *    adminId:
 *     type: string
 *    groupImage:
 *     type: string
 *     example: data:image/jpeg;base64
 *    members:
 *     type: array
 *     items: 
 *       type: string
 * 
 *  sendChat:
 *   type: object
 *   properties: 
 *    chatId:
 *     type: string
 *    senderId:
 *     type: string
 *    message:
 *     type: string
 *    members:
 *     type: array
 *     items:
 *       type: string
 * 
 *  updateGroup:
 *   type: object
 *   properties: 
 *    chatId:
 *     type: string
 *    title:
 *     type: string
 * 
 *  addGroupMember:
 *   type: object
 *   properties: 
 *    chatId:
 *     type: string
 *    members:
 *     type: array
 *     items: 
 *       type: string
 * 
 *  removeGroupMember:
 *   type: object
 *   properties: 
 *    chatId:
 *     type: string
 *    members:
 *     type: array
 *     items: 
 *       type: string
 * 
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
     * /chat/sendChat:
     *  post:
     *   summary: send normal message
     *   tags: 
     *    - chat
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/sendChat'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/chat/sendChat', [
        MessagingController.sendMessage
    ]);

    /**
     * @swagger
     * /chat/sendGroupChat:
     *  post:
     *   summary: send group message
     *   tags: 
     *    - chat
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/sendChat'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/chat/sendGroupChat', [
        MessagingController.sendMessage
    ]);

    /**
     * @swagger
     * /chat/getMessages/{chatId}:
     *  get:
     *   summary: get messages
     *   tags:  
     *     - chat
     *   parameters:
     *    - in: path
     *      name: chatId
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
     app.get('/chat/getMessages/:chatId', [
        MessagingController.getMessages
    ]);

    /**
     * @swagger
     * /chat/getChats/{userId}:
     *  get:
     *   summary: get user chats
     *   tags:  
     *     - chat
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
     app.get('/chat/getChats/:userId', [
        MessagingController.getUserChats
    ]);

    /**
     * @swagger
     * /chat/updateGroup:
     *  patch:
     *   summary: update group info
     *   tags: 
     *    - chat
     *   requestBody: 
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/updateGroup'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/chat/updateGroup', [
        MessagingController.updateGroup
    ]);


    /**
     * @swagger
     * /chat/addMember:
     *  patch:
     *   summary: add new member
     *   tags: 
     *    - chat
     *   requestBody: 
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addGroupMember'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
     app.patch('/chat/addMember', [
        MessagingController.addMember
    ]);

    /**
     * @swagger
     * /chat/removeMember:
     *  patch:
     *   summary: remove member
     *   tags: 
     *    - chat
     *   requestBody: 
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/removeGroupMember'
     *   security:
     *     - bearerAuth: []
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.patch('/chat/removeMember', [
        MessagingController.removeMember
    ]);

    /**
     * @swagger
     * /chat/deleteGroup/{chatId}:
     *  delete:
     *   summary: delete group
     *   tags:  
     *     - chat
     *   parameters:
     *    - in: path
     *      name: chatId
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
    app.delete('/chat/deleteGroup/:chatId', [
        MessagingController.deleteGroup
    ])

    /**
     * /chat/getChats/{userId}/{page}/{pageSize}:
     *  get:
     *   summary: get user chats
     *   tags:  
     *     - chat
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
    // app.get('/chat/getChats/:userId/:page/:pageSize', [
    //     MessagingController.getChats
    // ]);

};