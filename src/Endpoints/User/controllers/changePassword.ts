import bcrypt  from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import {REQUEST_WITH_USER, CHANGE_PASSWORD, USER } from '../Models'
import pool from "../../../Database/db";
import { STATUS } from "../../../config";


export const changePassword = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => { 
    
    const request = <REQUEST_WITH_USER>req;

    const passwords = req.body;

    try {
         
        CHANGE_PASSWORD.parse(passwords);

        const _id = request.user._id;

        const query = await pool.query({
            text: `SELECT * FROM users WHERE users._id = $1`,
            values: [_id]
        });

        if (query.rowCount < 1) {

            return res.status(STATUS.BAD_REQUEST).json({
            code:"PASSWORD_CHANGE_FAILED",
            message: 'Could not find user account',
            type: "error"
        });
        }
        
        const user:USER = query.rows[0];

        const decode = await bcrypt.compare(passwords.currentPassword, user.password);

        if (!decode) {
           return res.status(STATUS.UNAUTHORIZED).json({
            code:"PASSWORD_CHANGE_FAILED",
            message: `Permission denied: You are not allowed to change this user's password. Wrong password`,
            type: "error"
        });
        }

        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(passwords.newPassword, salt);

        const updatedUser = await pool.query({
            text: `UPDATE users SET password = $2, must_change_password = false WHERE users._id = $1 RETURNING _id, surname, other_names, email, role,must_change_password, created_at, updated_at`,
            values: [_id, newPass]
        });

        return res.status(STATUS.OK).json({
            code:"PASSWORD_CHANGED",
            message: 'Password changed successfully',
            type: 'success',
            data: updatedUser.rows[0]
        });
        
        
    } catch (error) {
        
        const err = <Error>error;
        next(err);

    }
   

}