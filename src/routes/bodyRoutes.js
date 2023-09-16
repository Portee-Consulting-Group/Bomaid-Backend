const BodyController = require('../controllers/bodyController');

/**
 * @swagger
 * definitions:
 *  addBody: 
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: full body 
 *    bodyImage:
 *     type: string
 *     example: data:image/jpeg;base64   
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /body/add:
     *  post:
     *   summary: add body
     *   tags: 
     *    - body
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addBody'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/body/add', [
        BodyController.add
    ]);

    /**
     * @swagger
     * /body/{page}/{pageSize}:
     *  get:
     *   summary: get all 
     *   tags:  
     *     - body
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
     app.get('/body/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        BodyController.getAll
    ]);
}