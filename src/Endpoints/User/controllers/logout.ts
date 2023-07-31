import { Request, Response } from 'express';

import { STATUS } from '../../../config';




export const logout = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>) => {

  res.cookie('token','', {
    httpOnly: true,
    expires: new Date(0)
  })


  
  return res.status(STATUS.OK).json({
    code:"LOGGED_OUT",
    message: "Logged out successfully",
    type:'success'
  })

}
