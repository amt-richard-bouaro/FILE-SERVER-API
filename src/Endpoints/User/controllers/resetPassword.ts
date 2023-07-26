import bcrypt from 'bcrypt';
import {v4 as uuidv4}  from "uuid";
import { NextFunction, Request, Response } from "express";
import {REQUEST_WITH_USER, USER,USER_EMAIL } from '../Models'
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

import { mailOptions, sendMail } from '../../../utils/email';
import { passwordChanged } from '../../../utils/mailTemplate';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

    const request = <REQUEST_WITH_USER>req;

    const {email} = req.body;

    try {

        USER_EMAIL.parse({email});

        const query = await pool.query({
            text: `SELECT * FROM users WHERE users.email = $1`,
            values: [email]
        });

        if (query.rowCount < 1) {
            res.status(STATUS.BAD_REQUEST);
            throw new Error('Password reset failed');
        }

        const password: string = 'L-' + uuidv4().replace('-', "").substring(0, 6)

        // console.log(password);

        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(password, salt);

        const passUpdated = await pool.query({
            text: `UPDATE users SET password = $2, must_change_password = true WHERE users.email = $1 RETURNING *`,
            values: [email, newPass]
        });

        // after update send new password to user via email
        // here

        sendMail(mailOptions({
            to: email,
            subject: 'Password Reset',
            html: passwordChanged(password)
        }));

        return res.status(200).json({
            code:"PASSWORD_RESET_SUCCESS",
            message: 'Password reset successful. A new password has been generated and sent to your registered email address. For security reasons, please change your password as soon as possible.',
            data: null
        });


    } catch (error) {

        const err = <Error>error;
        next(err);

    }


}
