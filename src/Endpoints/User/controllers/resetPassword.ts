import bcrypt from 'bcrypt';
import {v4 as uuidv4}  from "uuid";
import { NextFunction, Request, Response } from "express";
import {REQUEST_WITH_USER, USER,USER_EMAIL } from '../Models'
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

import { mailOptions, sendMail } from '../../../utils/email';
import { passwordChanged } from '../../../utils/mailTemplate';

export const resetPassword = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {

    const {email} = req.body;

    try {

        USER_EMAIL.parse({email});

        const getAccountInfo = await pool.query({
            text: `SELECT * FROM users WHERE users.email = $1`,
            values: [email]
        });

        if (getAccountInfo.rowCount < 1) {
            return res.status(STATUS.BAD_REQUEST).json({
                code: "RESET_FAILED",
                message: "Could not retrieve the account information specified",
                type:'error'
            })
        }

        const currentPassword = getAccountInfo.rows[0].password
        const password: string = 'L-' + uuidv4().replace('-', "").substring(0, 6)

        // console.log(password);

        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(password, salt);

        await pool.query({
            text: `UPDATE users SET password = $2, must_change_password = true WHERE users.email = $1 RETURNING *`,
            values: [email, newPass]
        });

        // after update send new password to user via email
        // here

        sendMail(mailOptions({
            to: email,
            subject: 'Password Reset',
            html: passwordChanged(password)
        }), async (err, result) => {
        if (err) {
         await pool.query({
            text: `UPDATE users SET password = $1, must_change_password = false WHERE users.email = $1 `,
            values: [currentPassword]
         });
          
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            code:"PASSWORD_RESET_SUCCESS",
            message: 'Password reset failed. Please try again later',
            type: "error"
        });
            
            
        } else {
            return res.status(STATUS.OK).json({
            code:"PASSWORD_RESET_SUCCESS",
            message: 'Password reset successful. A new password has been generated and sent to your registered email address. For security reasons, please change your password as soon as possible.',
            type: "success"
        });
            
        }
    });

       


    } catch (error) {

        const err = <Error>error;
        next(err);

    }


}
