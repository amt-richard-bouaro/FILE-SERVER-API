import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import { USER_CREDENTIALS ,USER} from '../Models'
import pool from '../../../Database/db'
import { STATUS } from '../../../config';
import tokenGenerator from '../../../utils/tokenGenerator';


export const authUser = async (req: Request<{},{},USER_CREDENTIALS>, res: Response, next: NextFunction) => {
    
 let user_credentials = req.body;

  try {
      
    USER_CREDENTIALS.parse(user_credentials);

      const userExits = await pool.query({
        text: 'SELECT* FROM users  WHERE email = $1',
        values: [user_credentials.email],
      }); 
      

      if (userExits.rowCount < 1) { 
        res.status(STATUS.UNAUTHORIZED);
        throw new Error(`The password and email combination is invalid or missing`);
      };
    
    const user:USER = userExits.rows[0]
    
    const decode = await bcrypt.compare(user_credentials.password, user.password)

  
      if (!decode) {
        res.status(STATUS.UNAUTHORIZED);
        throw new Error(`The password and email combination is invalid or missing`);
    }
    
    tokenGenerator(res, {_id:user._id});

    return res.status(STATUS.OK).send({
      code:"LOGIN_SUCCESS",
      message: "Logged in successfully",
      data: {
        surname: user.surname,
        other_names: user.other_names,
        email: user.email,
        role: user.role,
        must_change_password: user.must_change_password,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

    } catch (error) {
     
      const err = <Error>error
      return next(err);
    }
}