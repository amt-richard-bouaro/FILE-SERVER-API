import express from 'express';

import { authUser } from './controllers/auth';
import { registerUser } from './controllers/register';
import { logout } from './controllers/logout';
import { getUsers } from './controllers/getUsers';
import {getUser}  from './controllers/getUser';
import { changePassword } from './controllers/changePassword';
import { resetPassword } from './controllers/resetPassword';


import { authenticate } from '../../Middlewares/authenticate';


const app = express.Router();


app.get('/', authenticate, getUsers);

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
 *             $ref: '#/components/schemas/User_Registration'
 *     responses:
 *       201:
 *         description: Created
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User_Registration_Response'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
  
 *        
 */
app.post('/register', registerUser);

app.get('/logout', logout);

app.put('/password/change', authenticate, changePassword);

app.put('/password/reset', resetPassword);

app.get('/:_id', authenticate, getUser);


export default app;