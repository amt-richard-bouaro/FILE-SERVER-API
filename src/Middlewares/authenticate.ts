import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { SERVER_CONFIG, STATUS } from "../config";
import pool from "../Database/db";
import { USER } from "../Endpoints/User/Models";


interface JWT_PAYLOAD extends JwtPayload {
    _id: string
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    let token;

    //set the token to token in request cookies
    token = req.cookies.token; 

    // console.log(req);
    

    if (token) {
        try {

            //extract signed user information from the token
            const decode: JWT_PAYLOAD = Jwt.verify(token, SERVER_CONFIG.JWT_SECRET) as JWT_PAYLOAD;

            //fetch user information from the database
            const query = await pool.query({
                text: `SELECT _id, surname, other_names, email, role, must_change_password FROM users WHERE _id = $1`,
                values: [decode._id]
            });

            
            // 
            if (query.rowCount > 0) {
                
                const user: USER = query.rows[0];
                
                if (user.must_change_password === true && req.url !== '/password/change') {
                    
                    // res.status(STATUS.FORBIDDEN);

                    // throw new Error('For security reasons, please change your password as soon as possible.');

                    return res.status(STATUS.FORBIDDEN).json({
                        code: "FORBIDDEN",
                        message: "For security reasons, please change your password as soon as possible.",
                        data: null
                    });
                }

            }

            //merge user with req
            Object.assign(req, { user: query.rows[0] });

            //call next middleware
            return next();

        } catch (error) {
            
            //instantiate an error
            let err = <Error>error;

            //call next middleware
            return next(err);
        }
    } else {

        return res.status(STATUS.UNAUTHORIZED).json({
            code: "UNAUTHORIZED",
            message: "Unauthorized: No token",
            data:null
        })

        // //set response status
        // res.status(STATUS.UNAUTHORIZED);

        // //instantiate an error
        // let err = new Error('Unauthorized: no token');

        //  //call next middleware
        // return next(err);
    }


}







