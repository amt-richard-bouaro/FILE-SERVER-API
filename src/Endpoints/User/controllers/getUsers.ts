import { NextFunction, Request, Response } from 'express';
import pool from '../../../Database/db';
import { REQUEST_WITH_USER } from '../Models';
import { STATUS } from '../../../config';




/**
 * 
* @openapi
 * components:
 *   schemas:
 *     Users:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           surname:
 *             type: string
 *           other_names:
 *             type: string
 *           email:
 *             type: string
 *           role:
 *             type: string
 *           must_change_password:
 *             type: boolean
 *           created_at:
 *             type: string
 *     
 * 
 */

export const getUsers = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {
    

    const request = <REQUEST_WITH_USER>req

    try {


        if (request.user.role !== 'admin') {
            return res.status(STATUS.FORBIDDEN).json({
            code: 'USERS_REQUEST_FAILED',
                message: 'Unauthorized: Permission denied for user role type [user] - expected [admin]',
            type:'error'
        })
        }

        const users = await pool.query({
            text: `SELECT _id, surname, other_names, email, role,must_change_password, created_at, updated_at FROM users`,
            values:[]
        })

        return res.status(STATUS.OK).json({
            code: 'USERS',
            message: 'Available users',
            type: 'success',
            data:users.rows
        })
        
    } catch (error) {   
        const err = <Error>error
        return next(err);          
    }

    
}