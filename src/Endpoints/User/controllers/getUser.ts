import { NextFunction, Request, Response } from 'express';
import pool from '../../../Database/db';
import { STATUS } from '../../../config';
import {REQUEST_WITH_USER } from '../Models'
import { type } from 'os';

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
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
 *         must_change_password:
 *           type: boolean
 *         created_at:
 *           type: string
 *         updated_at:
 *           type: string
 */


export const getUser = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next:NextFunction) => {

    const request = <REQUEST_WITH_USER>req;

    
try {

    const userId = request.params._id
    
        const user = await pool.query({
            text: `SELECT _id, surname, other_names, email, role, must_change_password, created_at, updated_at FROM users WHERE _id = $1`,
            values:[userId]
        })
    
        if (user.rowCount < 1) {
            return res.status(STATUS.BAD_REQUEST).json({
                code: `USER_NOT_FOUND`,
                message:'The user specified was not found',
                type:'error'
      });
        }

    return res.status(200).json({
        code: `USER`,
        message: 'User with id specified',
        type:'success',
        data:user.rows[0]
    })
        
    } catch (error) {
    const err = <Error>error;
    
    return next(err);          
    }
}