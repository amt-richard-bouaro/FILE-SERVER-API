import { NextFunction, Request, Response } from 'express';
import pool from '../../../Database/db';
import { STATUS } from '../../../config';
import {REQUEST_WITH_USER } from '../Models'

export const getUser = async (req: Request, res: Response, next:NextFunction) => {

    const request = <REQUEST_WITH_USER>req;
try {

    const userId = request.params._id
    
        const user = await pool.query({
            text: `SELECT _id, surname, other_names, email, role, created_at, updated_at FROM users WHERE _id = $1`,
            values:[userId]
        })
    
        if (user.rowCount < 1) {
        res.status(STATUS.BAD_REQUEST);
        throw new Error(`Invalid user id`);
        }

        return res.status(200).json(user.rows[0])
        
    } catch (error) {
    const err = <Error>error;
    
    return next(err);          
    }
}