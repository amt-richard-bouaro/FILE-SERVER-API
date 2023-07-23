import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {v4 as uuidv4}  from "uuid";
import { PRIMARY_USER_DATA, USER } from "../Models";
import pool from '../../../Database/db';

import { STATUS } from "../../../config";

/**
 * 
* @openapi
 * components:
 *   schemas:
 *     User_Registration:
 *       type: object
 *       properties:
 *         surname:
 *           type: string
 *           default: Smith
 *         other_names:
 *           type: string
 *           default: Michael Owusu
 *         email:
 *           type: string
 *           default: msmith@example.com
 *         password:
 *           type: string
 *           default: oWusu247
 *           format: password
 *         role:
 *           type: string
 *           default: user
 *           enum:
 *             - admin
 *             - user
 *       required:
 *         - surname
 *         - other_names
 *         - email
 *         - password
 *         - role
 *     User_Registration_Response:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         surname:
 *           type: string
 *         other_names:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         created_at::
 *           type: string
 *     
 * 
 */
export const registerUser = async (req:Request<{},{}, PRIMARY_USER_DATA>, res:Response, next:NextFunction) => {
    
  let user_data = req.body;

  try {
      
    PRIMARY_USER_DATA.parse(user_data);

      const userExits = await pool.query({
        text: 'SELECT* FROM users  WHERE email = $1',
        values: [user_data.email],
      }); 
      
      // pool.end();

      if (userExits.rowCount > 0) { 
        res.status(STATUS.CONFLICT);
        throw new Error(`There is already a user with that email: ${user_data.email}`);
      };
       
    const user = {_id:uuidv4(),...user_data}
    
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    
    let role = 'user'

    if (user.role) { 
      role = user.role
    }

      const createUser = await pool.query({
        text: 'INSERT INTO users(_id, surname, other_names, email, password, role ) VALUES($1, $2, $3, $4, $5, $6)RETURNING *',
        values: [user._id, user.surname, user.other_names, user.email, user.password, role],
      }); 

      
      if (createUser.rowCount < 1) {
        res.status(STATUS.INTERNAL_SERVER_ERROR);
        throw new Error(`Error occurred while creating user`);
    }
    
    const returnUser = createUser.rows[0];

    return res.status(STATUS.CREATED).json({
      code:'USER_CREATED',
      message:'Registration was successfully! You can now access the application using your email address.',
      data: { _id: user._id,
        surname: user.surname,
        other_name: user.other_names,
        email: user.email,
        role: returnUser.role,
        created_at: returnUser.created_at,}
      });

    } catch (error) {
    const err = error as Error

      next(err);
    } 

 

  
}