import { Request,Response,NextFunction } from "express";
import { REQUEST_WITH_USER } from "../Endpoints/User/Models";
import { STATUS } from "../config";



export const restrictedToAdmin = async (req: Request, res: Response<{ code: string, message: string, type: 'error' | 'success', data?: any[] | {} | null }>, next: NextFunction) => { 

    const request = <REQUEST_WITH_USER>req

    const role = request.user.role;

    if (role !== 'admin') {
        
        return res.status(STATUS.UNAUTHORIZED).json({
            code: "UNAUTHORIZED",
            message: "This is restricted to the admin user",
            type: "error"
        });
    }


    next();

}