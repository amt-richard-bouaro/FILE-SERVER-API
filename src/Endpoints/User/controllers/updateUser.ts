import { NextFunction, Request, Response } from "express";
import {  REQUEST_WITH_USER, UPDATE_USER_DATA, } from "../Models";
import pool from '../../../Database/db';

import { STATUS } from "../../../config";


/**
 * 
* @openapi
 * components:
 *   schemas:    
 * 
 */
export const updateUser = async (req: Request<{}, {}, UPDATE_USER_DATA>, res: Response<{ code: string, message: string, type: 'error' | 'success', data?: any }>, next: NextFunction) => {

    let user_data = req.body;
    const request = <REQUEST_WITH_USER>req

    try {

        UPDATE_USER_DATA.parse(user_data);

        const { surname, other_names, email } = user_data
        const ID = request.user._id

        const checkoutUser = await pool.query({
            text: 'SELECT _id, surname, other_names, email, role, must_change_password, created_at, updated_at FROM users WHERE email = $1 AND _id != $2',
            values: [email, ID],
        });

        if (checkoutUser.rowCount > 0) {
             return res.status(STATUS.BAD_REQUEST).json({
                code: `EMAIL_TAKEN`,
                message: `Email Already taken`,
                type: 'error'

            });
        }
        
        const updateUser = await pool.query({
            text: 'UPDATE users SET surname = $1, other_names = $2, email = $3 WHERE _id = $4 RETURNING _id, surname, other_names, email, role, must_change_password, created_at, updated_at ',
            values: [surname,other_names, email, ID],
        });


        if (updateUser.rowCount < 1) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({

                code: `UPDATE_FAILED`,
                message: `Error occurred while updating user information. Please try again later.`,
                type: 'error'

            });
        }


        return res.status(STATUS.OK).json({
            code: 'USER_UPDATED',
            message: 'User information was updated successfully',
            type: 'success',
            data: updateUser.rows[0]
        });

    } catch (error) {
        const err = error as Error

        next(err);
    }




}