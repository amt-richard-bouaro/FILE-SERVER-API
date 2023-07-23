import nodemailer from 'nodemailer';
import { SERVER_CONFIG } from '../config';
import { log } from 'console';

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SERVER_CONFIG.EMAIL_ADDRESS,
        pass: SERVER_CONFIG.EMAIL_PASSWORD
    }
});

interface options {
    from?: {
        name: string;
        address: string;
    }
    to: string
    subject: string
    text?: string
    html?:string
}

export const mailOptions = (options: options) => {
    return {
        from:{
        name: 'GTP Phase 3',
        address: SERVER_CONFIG.EMAIL_ADDRESS 
        } || options.from ,
        to: options.to,
        subject: options.subject,
        text: options.text || 'text',
        html: options.html || '',
    }
};


export const sendMail = (mailOptions: options) => {
    transport.sendMail(mailOptions, (err, result) => {
        if (err) {
        //    throw new Error(err.message) 
            console.log(err);
            
        } else {
            console.log('email sent successfully');
            
        }
    })
}


