const SwimStyleController = require('../controllers/swimStyleController');
const upload = require('../common/multer');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  addStyle: 
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     example: stroke 
 *    styleImage:
 *     type: string
 *     example: data:image/jpeg;base64   
 */


exports.routesConfig = function (app) {
    /**
     * @swagger
     * /swim/style/add:
     *  post:
     *   summary: add swim style
     *   tags: 
     *    - swim style
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/addStyle'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/swim/style/add', [
        SwimStyleController.addStyle
    ]);

    /**
     * @swagger
     * /swim/style/{page}/{pageSize}:
     *  get:
     *   summary: get all styles
     *   tags:  
     *     - swim style
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
     app.get('/swim/style/:page/:pageSize',[
        // AuthValidationMiddleware.validJWTNeeded,
        // AuthPermissionMiddleware.adminLevelRequired,
        SwimStyleController.getSwimStyles
    ]);
}