import nodemailer from 'nodemailer';
import { SERVER_CONFIG } from '../config';
import { log } from 'console';
import { Attachment } from 'nodemailer/lib/mailer';

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
    html?: string,
    attachments?: Attachment[] | undefined
}

export const mailOptions = (options: options) => {
    return {
        from:{
        name: 'Lizzy Cloud Files',
        address: SERVER_CONFIG.EMAIL_ADDRESS 
        } || options.from ,
        to: options.to,
        subject: options.subject,
        text: options.text || 'text',
        html: options.html || '',
        attachments: options.attachments
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


