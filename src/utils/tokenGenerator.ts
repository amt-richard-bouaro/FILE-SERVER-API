import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { SERVER_CONFIG } from '../config'


const tokenGenerator = <T extends object>(res:Response, param:T) => {
    const token = jwt.sign(param, SERVER_CONFIG.JWT_SECRET, {
        expiresIn: '7d',  
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: SERVER_CONFIG.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

}

export default tokenGenerator;