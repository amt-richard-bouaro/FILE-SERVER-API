
import { z } from "zod";

import { Request } from "express";



const ROLES = ['admin', 'user'] as const

const PRIMARY_USER_DATA = z.object({
    surname: z.string()
        .min(3, 'Surname cannot be less than 3 characters')
        .nonempty('Provide you surname'),
    other_names: z.string()
        .min(3, 'Other names cannot be less than 3 characters')
        .nonempty('Provide you other names'),
    email: z.string()
        .nonempty('Email address is required.')
        .email('Please enter a valid email address.')
        .min(5),
    password: z.string()
        .nonempty('Password is required.')
        .refine(val => {
        if (val.length < 8) return false;

        if (!/[A-Z]/.test(val)) return false;
        
        if (!/[a-z]/.test(val)) return false;
        
        if (!/[^a-zA-Z0-9]/.test(val)) return false;

        return true;
    }, 'Passwords must be at least 8 characters long and include upper case, lower case, and special characters.'),
    confirmPassword: z.string().nonempty(),
    // role: z.enum(['user']),
}).refine((val) => val.password === val.confirmPassword, {
    message: `Password don't match`,
    path: ['confirmPassword'],
  
});

type PRIMARY_USER_DATA = z.infer<typeof PRIMARY_USER_DATA>

  
type USER = {
    _id: string
    surname: string
    other_names: string
    email: string
    role: "admin" | "user"
    password: string
    must_change_password: boolean
    created_at: string
    updated_at: string
}


const USER_CREDENTIALS = z.object({
    email: z.string().email(),
    password: z.string(),
})

type USER_CREDENTIALS = z.infer<typeof USER_CREDENTIALS>

interface REQUEST_WITH_USER extends Request {
    user: {
        _id: string,
        email: string,
        role: string,
        surname: string,
        other_names: string
    };
}

const CHANGE_PASSWORD = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string() .refine(val => {
        if (val.length < 8) return false;

        if (!/[A-Z]/.test(val)) return false;
        
        if (!/[a-z]/.test(val)) return false;
        
        if (!/[^a-zA-Z0-9]/.test(val)) return false;

        return true;
    }, 'Passwords must be at least 8 characters long and include upper case, lower case, and special characters.'),
    confirmPassword: z.string()
}).refine((val) => val.newPassword === val.confirmPassword, {
    message: `Password don't match`,
    path: ['confirmPassword'],
  
});

const CHANGE_PASSWORD_CONFIRMED = CHANGE_PASSWORD.refine(value => {
    if (value.newPassword !== value.confirmPassword) {
        
        throw new Error('Passwords do not match!');
    }
    return value;
});



const USER_EMAIL = z.object({
    email: z.string().email(),
})


const NEW_USER_DATA = z.object({
    surname: z.string()
        .min(3, 'Surname cannot be less than 3 characters')
        .nonempty('Provide you surname'),
    other_names: z.string()
        .min(3, 'Other names cannot be less than 3 characters')
        .nonempty('Provide you other names'),
    email: z.string()
        .nonempty('Email address is required.')
        .email('Please enter a valid email address.')
        .min(5),
    role: z.enum(ROLES),
})

type NEW_USER_DATA = z.infer<typeof NEW_USER_DATA>

const UPDATE_USER_DATA = z.object({
    surname: z.string()
        .min(3, 'Surname cannot be less than 3 characters')
        .nonempty('Provide you surname'),
    other_names: z.string()
        .min(3, 'Other names cannot be less than 3 characters')
        .nonempty('Provide you other names'),
    email: z.string()
        .nonempty('Email address is required.')
        .email('Please enter a valid email address.')
        .min(5),

})

type UPDATE_USER_DATA = z.infer<typeof UPDATE_USER_DATA>

export {PRIMARY_USER_DATA, USER, USER_CREDENTIALS, REQUEST_WITH_USER,CHANGE_PASSWORD_CONFIRMED,CHANGE_PASSWORD, USER_EMAIL,NEW_USER_DATA, UPDATE_USER_DATA}