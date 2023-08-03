import { NextFunction, Request, Response } from "express";
import { SERVER_CONFIG, STATUS } from "../config";
import { z } from "zod";
// import {}
export const notFoundError = ( req: Request, res: Response, next: NextFunction) => {
    // const error = new Error(`Not Found: ${req.originalUrl}`);
    // res.status(STATUS.NOT_FOUND)

      return res.status(STATUS.NOT_FOUND).json({
            code: "NOT_FOUND",
            message: "This route you've specified does not exist",
            type: "error",
            error: `Not Found: ${req.originalUrl}`
      })
}

export const errorHandler = <T extends Error>(err: T, req: Request, res: Response, next: NextFunction) => {
    
    let status = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message; 
    let code = 'Error';
    let type = 'error';

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

    if (err instanceof z.ZodError) {
        return res.status(STATUS.BAD_REQUEST).json({
            code: "VALIDATION_ERROR",
            message: "Parameters failed validation",
            type: "error",
            error: err.errors
      })
    }

    res.status(status).json({
        code,
        message,
        type: "error",
        stack: SERVER_CONFIG.NODE_ENV === 'production' ? null : err.stack
    });
  
}