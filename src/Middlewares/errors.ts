import { NextFunction, Request, Response } from "express";
import { SERVER_CONFIG, STATUS } from "../config";
// import {}
export const notFoundError = ( req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(STATUS.NOT_FOUND)
    next(error);
}

export const errorHandler = <T extends Error>(err: T, req: Request, res: Response, next: NextFunction) => {
    
    let status = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message; 
    let code = 'Error';

     if (err.name === 'ZodError') {    
         status = STATUS.BAD_REQUEST;
         message = JSON.parse(err.message);
         code = 'ValidationError'
    }

   
    

      if (err.name === 'TokenExpiredError') {    
          status = STATUS.UNAUTHORIZED;
          message = 'Unauthorized: invalid token';
          code = 'TokenExpired';
    }

    
    
    if (status === STATUS.FORBIDDEN) {
        code = 'MUST_CHANGE_PASSWORD';
    }


    res.status(status).json({
        code,
        message,
        stack: SERVER_CONFIG.NODE_ENV === 'production' ? null : err.stack
    });
  
}