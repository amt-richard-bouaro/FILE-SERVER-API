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

       const resetUserPassword =  await pool.query({
            text: `UPDATE users SET password = $2, must_change_password = true WHERE users.email = $1 RETURNING _id, surname, other_names, email, role, must_change_password, created_at, updated_at`,
            values: [email, newPass]
        });

        // after update send new password to user via email
        // here

        sendMail(mailOptions({
            to: email,
            subject: 'Password Reset',
            html: passwordChanged(password)
        }));

         return res.status(STATUS.OK).json({
            code:"PASSWORD_RESET_SUCCESS",
            message: 'Password reset successful. A new password has been generated and sent to your registered email address. For security reasons, please change your password as soon as possible.',
             type: "success",
            data: resetUserPassword.rows[0]
        });


    } catch (error) {

        const err = <Error>error;
        next(err);

    }


}
