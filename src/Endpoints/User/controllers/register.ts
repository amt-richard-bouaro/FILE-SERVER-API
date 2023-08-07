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
 *
 */
export const registerUser = async (req:Request<{},{}, PRIMARY_USER_DATA>, res:Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next:NextFunction) => {

  let user_data = req.body;

  try {

    PRIMARY_USER_DATA.parse(user_data);

      const userExits = await pool.query({
        text: 'SELECT* FROM users  WHERE email = $1',
        values: [user_data.email],
      });

      // pool.end();

      if (userExits.rowCount > 0) {
        return res.status(STATUS.CONFLICT).json({
          code: `USER_ALREADY_EXIT`,
          message: `There is already a user with that email: ${user_data.email}`,
          type: 'error'

      });
      };

    const user = {_id:uuidv4(),...user_data}

    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;

    const role = 'user'

      const createUser = await pool.query({
        text: 'INSERT INTO users(_id, surname, other_names, email, password, role ) VALUES($1, $2, $3, $4, $5, $6)RETURNING _id, surname, other_names, email, role,created_at,updated_at',
        values: [user._id, user.surname, user.other_names, user.email, user.password, role],
      });

    
    const returnUser = createUser.rows[0];

    return res.status(STATUS.CREATED).json({
      code:'USER_CREATED',
      message: 'Registration was successful. You can now access the application using your email address.',
      type: 'success',
      data: returnUser
      });

    } catch (error) {
    const err = error as Error


      next(err);
    }




}
