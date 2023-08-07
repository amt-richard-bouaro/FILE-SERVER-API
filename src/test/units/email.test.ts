import { transport, sendMail } from "../../utils/email";
import nodemailer from 'nodemailer';

import { SERVER_CONFIG } from '../../config';


jest.mock('nodemailer')


describe("Nodemailer Transport Configuration", () => {
    it("should be properly configured", () => {
         
        require('../../utils/email');

   
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: {
                user: SERVER_CONFIG.EMAIL_ADDRESS || '',
                pass: SERVER_CONFIG.EMAIL_PASSWORD || ''
            }
        });


    })

});



