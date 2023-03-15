const express = require('express');
const controller = require('../controllers/accounts.controller');
// const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

/**
 * Load services when API with servicesId route parameter is hit
 */
router.param('userName', controller.load);

router
	.route('/')
	/**
	 * @api {get} v1/service List Service
	 * @apiDescription Get a list of service
	 * @apiVersion 1.0.0
	 * @apiName ListService
	 * @apiGroup Services
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Service per page
	 * @apiParam  {String}             [name]       Services's name
	 * @apiParam  {String}             [email]      Services's email
	 * @apiParam  {String=services,admin}  [role]       Services's role
	 *
	 * @apiSuccess {Object[]} service List of service.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated service can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(controller.list)
	/**
	 * @api {post} v1/Service Create Services
	 * @apiDescription Create a new services
	 * @apiVersion 1.0.0
	 * @apiName CreateServices
	 * @apiGroup Services
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiParam  {String}             email     Services's email
	 * @apiParam  {String{6..128}}     password  Services's password
	 * @apiParam  {String{..128}}      [name]    Services's name
	 * @apiParam  {String=services,admin}  [role]    Services's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Services's id
	 * @apiSuccess (Created 201) {String}  name       Services's name
	 * @apiSuccess (Created 201) {String}  email      Services's email
	 * @apiSuccess (Created 201) {String}  role       Services's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated service can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(controller.create);

router
	.route('/getByUserName/:userName')
	/**
	 * @api {get} v1/service/:id Get Services
	 * @apiDescription Get services information
	 * @apiVersion 1.0.0
	 * @apiName GetServices
	 * @apiGroup Services
	 * @apiPermission services
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiSuccess {String}  id         Services's id
	 * @apiSuccess {String}  name       Services's name
	 * @apiSuccess {String}  email      Services's email
	 * @apiSuccess {String}  role       Services's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated service can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only service with same id or admins can access data
	 * @apiError (Not Found 404)    NotFound     Services does not exist
	 */
	.get(controller.get)
	/**
	 * @api {put} v1/service/:id Replace Services
	 * @apiDescription Replace the whole services document with a new one
	 * @apiVersion 1.0.0
	 * @apiName ReplaceServices
	 * @apiGroup Services
	 * @apiPermission services
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiParam  {String}             email     Services's email
	 * @apiParam  {String{6..128}}     password  Services's password
	 * @apiParam  {String{..128}}      [name]    Services's name
	 * @apiParam  {String=services,admin}  [role]    Services's role
	 * (You must be an admin to change the services's role)
	 *
	 * @apiSuccess {String}  id         Services's id
	 * @apiSuccess {String}  name       Services's name
	 * @apiSuccess {String}  email      Services's email
	 * @apiSuccess {String}  role       Services's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated service can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only service with same id or admins can modify data
	 * @apiError (Not Found 404)    NotFound     Services does not exist
	 */
	.put(controller.replace)
	/**
	 * @api {patch} v1/service/:id Update Services
	 * @apiDescription Update some fields of a services document
	 * @apiVersion 1.0.0
	 * @apiName UpdateServices
	 * @apiGroup Services
	 * @apiPermission services
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiParam  {String}             email     Services's email
	 * @apiParam  {String{6..128}}     password  Services's password
	 * @apiParam  {String{..128}}      [name]    Services's name
	 * @apiParam  {String=services,admin}  [role]    Services's role
	 * (You must be an admin to change the services's role)
	 *
	 * @apiSuccess {String}  id         Services's id
	 * @apiSuccess {String}  name       Services's name
	 * @apiSuccess {String}  email      Services's email
	 * @apiSuccess {String}  role       Services's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated service can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only service with same id or admins can modify data
	 * @apiError (Not Found 404)    NotFound     Services does not exist
	 */
	.patch(controller.update)
	/**
	 * @api {patch} v1/service/:id Delete Services
	 * @apiDescription Delete a services
	 * @apiVersion 1.0.0
	 * @apiName DeleteServices
	 * @apiGroup Services
	 * @apiPermission services
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated service can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only service with same id or admins can delete
	 * @apiError (Not Found 404)    NotFound      Services does not exist
	 */
	.delete(controller.remove);

router
	.route('/getAccountById/:id')
	/**
	 * @api {get} v1/service/:id Get Services
	 * @apiDescription Get services information
	 * @apiVersion 1.0.0
	 * @apiName GetServices
	 * @apiGroup Services
	 * @apiPermission services
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiSuccess {String}  id         Services's id
	 * @apiSuccess {String}  name       Services's name
	 * @apiSuccess {String}  email      Services's email
	 * @apiSuccess {String}  role       Services's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated service can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only service with same id or admins can access data
	 * @apiError (Not Found 404)    NotFound     Services does not exist
	 */
	.get(controller.getAccountById);

router
	.route('/signin')
	/**
	 * @api {get} v1/service List Service
	 * @apiDescription Get a list of service
	 * @apiVersion 1.0.0
	 * @apiName ListService
	 * @apiGroup Services
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Services's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Service per page
	 * @apiParam  {String}             [name]       Services's name
	 * @apiParam  {String}             [email]      Services's email
	 * @apiParam  {String=services,admin}  [role]       Services's role
	 *
	 * @apiSuccess {Object[]} service List of service.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated service can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.post(controller.signin);

module.exports = router;
