import nodemailer, { SentMessageInfo } from 'nodemailer';
import { SERVER_CONFIG } from '../config';
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


export const sendMail = (mailOptions: options, callback:(err: Error | null, info: SentMessageInfo) => void) => {
    transport.sendMail(mailOptions, callback)
}


