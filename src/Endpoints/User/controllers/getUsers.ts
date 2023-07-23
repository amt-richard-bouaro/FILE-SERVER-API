import { NextFunction, Request, Response } from 'express';
import pool from '../../../Database/db';


export const getUsers = async (req: Request, res: Response, next:NextFunction) => {

    try {

        const users = await pool.query({
            text: `SELECT _id, surname, other_names, email, role, created_at, updated_at FROM users`,
            values:[]
        })

        return res.status(200).json(users.rows)
        
    } catch (error) {   
        const err = <Error>error
        return next(err);          
    }

    
}