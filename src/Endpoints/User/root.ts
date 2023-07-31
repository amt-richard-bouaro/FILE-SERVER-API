import express from 'express';

import { authUser } from './controllers/auth';
import { registerUser } from './controllers/register';
import { logout } from './controllers/logout';
import { getUsers } from './controllers/getUsers';
import {getUser}  from './controllers/getUser';
import { changePassword } from './controllers/changePassword';
import { resetPassword } from './controllers/resetPassword';


import { authenticate } from '../../Middlewares/authenticate';
import { restrictedToAdmin } from '../../Middlewares/accessRestriction';
import { createUser } from './controllers/createUser';
import { updateUser } from './controllers/updateUser';



const app = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: USERS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Users'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/', authenticate,restrictedToAdmin, getUsers);

/**
 * @openapi
 * /api/users/auth:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: LOGIN SUCCESS
 *         headers:
 *           Set-Cookie:
 *             description: Session cookie containing JWT token. HttpOnly cookies; secure=true
 *             schema:
 *               type: string
 *             example: token=jwt_token_value; HttpOnly; Secure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: VALIDATION ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Validation_Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */

app.post('/auth', authUser);

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surname:
 *                 type: string
 *                 default: Smith
 *               other_names:
 *                 type: string
 *                 default: Michael Owusu
 *               email:
 *                 type: string
 *                 default: msmith@example.com
 *               password:
 *                 type: string
 *                 default: oWusu247
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 default: oWusu247
 *                 format: password
 *             required:
 *               - surname
 *               - other_names
 *               - email
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: CONFLICT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       400:
 *         description: BAD REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.post('/register', registerUser);

/**
 * @openapi
 * /api/users/add/new:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user - this can only be performed by admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surname:
 *                 type: string
 *                 default: Smith
 *               other_names:
 *                 type: string
 *                 default: Michael Owusu
 *               email:
 *                 type: string
 *                 default: msmith@example.com
 *               role:
 *                 type: string
 *                 default: user
 *                 enum:
 *                   - admin
 *                   - user
 *             required:
 *               - surname
 *               - other_names
 *               - email
 *               - role
 *     responses:
 *       201:
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: CONFLICT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       400:
 *         description: BAD REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.post('/add/new',authenticate, restrictedToAdmin, createUser);

/**
 * @openapi
 * /api/users/logout:
 *   get:
 *     tags:
 *       - Users
 *     summary: Logout user
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: LOGOUT SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   default: LOGGED_OUT
 *                 message:
 *                   type: string
 *                   default: Logged out successfully
 *                 type:
 *                   type: string
 *                   default: success
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: error
 */
app.get('/logout',authenticate, logout);

/**
 * @openapi
 * /api/users/password/change:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/Error_Response'
 *                 - $ref: '#/components/schemas/Validation_Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.put('/password/change', authenticate, changePassword);

/**
 * @openapi
 * /api/users/information/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user information
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surname:
 *                 type: string
 *               other_names:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/Error_Response'
 *                 - $ref: '#/components/schemas/Validation_Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.put('/information/update', authenticate, updateUser);

/**
 * @openapi
 * /api/users/password/reset:
 *   put:
 *     tags:
 *       - Users
 *     summary: Recover lost password thus password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *       400:
 *         description: BAD REQUEST
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *        
 */
app.put('/password/reset', resetPassword);

/* The above code is defining an OpenAPI specification for a GET request to retrieve a particular user.
It specifies the endpoint `/api/user/{_id}` and includes tags, summary, parameters, and responses
for the request. The parameters include `_id` as a path parameter and `token` as an optional header
parameter for authentication. The responses include success, bad request, unauthorized, and internal
server error scenarios, each with their respective descriptions and content schemas. */


/**
 * @openapi
 * /api/users/{_id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a particular user
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: User to retrieve
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: USER
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/:_id', authenticate, getUser);


export default app;