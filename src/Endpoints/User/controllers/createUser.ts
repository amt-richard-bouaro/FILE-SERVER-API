import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { NEW_USER_DATA, PRIMARY_USER_DATA, USER } from "../Models";
import pool from '../../../Database/db';

import { STATUS } from "../../../config";
import { mailOptions, sendMail } from "../../../utils/email";
import { passwordChanged } from "../../../utils/mailTemplate";

/**
 * 
* @openapi
 * components:
 *   schemas:    
 * 
 */
export const createUser = async (req: Request<{}, {}, NEW_USER_DATA>, res: Response<{ code: string, message: string, type: 'error' | 'success', data?: any[] | {} | null }>, next: NextFunction) => {

    let user_data = req.body;

    try {

        NEW_USER_DATA.parse(user_data);

        const userExits = await pool.query({
            text: 'SELECT* FROM users  WHERE email = $1',
            values: [user_data.email],
        });

        // pool.end();

        if (userExits.rowCount > 0) {
            return res.status(STATUS.CONFLICT).json({
                code: `USER_ALREADY_EXIT`,
                message: `There is already a user with that email: ${user_data.email}`,
                type: 'error'

            });
        };

        const user = { _id: uuidv4(), ...user_data }
        let pass: string = 'L-' + uuidv4().replace('-', "").substring(0, 6)

        // console.log(password);

        const salt = await bcrypt.genSalt(10);



        const hashPassword = await bcrypt.hash(pass, salt);
        const password = hashPassword;



        const createUser = await pool.query({
            text: 'INSERT INTO users(_id, surname, other_names, email, password, role, must_change_password ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [user._id, user.surname, user.other_names, user.email, password, user.role, true],
        });


        if (createUser.rowCount < 1) {

            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({

                code: `USER_REGISTRATION_FAILED`,
                message: `Error occurred while creating user`,
                type: 'error'

            });
        }


        sendMail(mailOptions({
            to: user.email,
            subject: 'Password Reset',
            html: passwordChanged(pass)
        }),
            async (err, result) => {
                if (err) {

                    await pool.query({
                        text: 'DELETE FROM users WHERE _id = $1',
                        values: [user._id],
                    });
                    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                        code: "PASSWORD_RESET_FAILED",
                        message: 'Password reset failed. Please try again later',
                        type: "error"
                    });


                }

            });




        const returnUser = createUser.rows[0];

        return res.status(STATUS.CREATED).json({
            code: 'USER_CREATED',
            message: 'User successfull created. User can now access the application using their email address and password sent to the email address provided.',
            type: 'success',
            data: {
                _id: user._id,
                surname: user.surname,
                other_name: user.other_names,
                email: user.email,
                role: returnUser.role,
                must_change_password: returnUser.must_change_password,
                created_at: returnUser.created_at,
                updated_at: returnUser.updated_at
            }
        });

    } catch (error) {
        const err = error as Error

        next(err);
    }




}