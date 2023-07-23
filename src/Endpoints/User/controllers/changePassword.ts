import bcrypt  from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import {REQUEST_WITH_USER, CHANGE_PASSWORD_CONFIRMED, USER } from '../Models'
import pool from "../../../Database/db";
import { STATUS } from "../../../config";


export const changePassword = async (req: Request, res: Response, next: NextFunction) => { 
    
    const request = <REQUEST_WITH_USER>req;

    const passwords = req.body;

    try {
         
        CHANGE_PASSWORD_CONFIRMED.parse(passwords);

        const _id = request.user._id;

        const query = await pool.query({
            text: `SELECT * FROM users WHERE users._id = $1`,
            values: [_id]
        });

        if (query.rowCount < 1) {
            res.status(STATUS.BAD_REQUEST);
            throw new Error('Could not find user with id ' + _id);
        }
        
        const user:USER = query.rows[0];

        const decode = await bcrypt.compare(passwords.currentPassword, user.password);

        if (!decode) {
        res.status(STATUS.UNAUTHORIZED);
        throw new Error(`Permission denied: You are not allowed to change your password`);
        }

        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(passwords.newPassword, salt);

        const passUpdated = await pool.query({
            text: `UPDATE users SET password = $2, must_change_password = false WHERE users._id = $1 RETURNING *`,
            values: [_id, newPass]
        });

        return res.status(200).json({ message: 'Password changed' });
        
        
    } catch (error) {
        
        const err = <Error>error;
        next(err);

    }
   

}