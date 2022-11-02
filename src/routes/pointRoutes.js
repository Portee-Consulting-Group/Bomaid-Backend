const PointController = require('../controllers/pointController');
const AuthValidationMiddleware = require('../middleware/authValidationMiddleware');

/**
 * @swagger
 * definitions:
 *  getPoint: 
 *   type: object
 *   properties:
 *    goalTypeId:
 *     type: string
 *    userId:
 *     type: string
 */
exports.routesConfig = function (app) {

    /**
     * @swagger
     * /point/calculateUserPoint:
     *  post:
     *   summary: get point
     *   tags: 
     *    - point
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref: '#/definitions/getPoint'
     *   responses:
     *      200:
     *       description: successful response
     *      400:
     *       description: request failed
     */
    app.post('/point/calculateUserPoint', [
        PointController.calculateUserPoint
    ]);
};