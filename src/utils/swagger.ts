import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { STATUS } from '../config';
import path from 'path';
import fs from 'fs';


const router = require('express').Router();


const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'File Server API Documentation',
            version: '1.0.0',
            contact: {
                name: "API Support",
                url: "https://file-server-api.vercel.app/api/",
                email: "richard.bouaro@amalitech.org",
            },
        },
        servers: [
            {
                url: "https://file-server-api.vercel.app/",
                description: "File Server API Documentation",
            },
        ],
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'https',
                    schema: 'token',
                    bearerFormat: 'jwt'
                }
            }
        },
        security: [{
            bearerAuth: [],
        }]

    },

    apis: ['./src/Endpoints/*.ts', './src/Endpoints/User/*.ts', './src/Endpoints/Document/*.ts', './src/Endpoints/Document/controllers/*.ts', './src/Endpoints/User/controllers/*.ts']


}

export const customOptions = {
    customSiteTitle: "File Server Api",
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.3.1/swagger-ui.min.css',
    
}

export const spec = JSON.parse(
    fs.readFileSync(path.join(__dirname, './docs.json'), 'utf8')
);


export const swaggerSpec = swaggerJsdoc(options);



router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec));


function swaggerDocs(app: Express, port: number) {


    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec, {...customOptions}));


    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(STATUS.OK).json(spec);
    })

    console.log(`Docs available at https://file-server-api.vercel.app/api/docs`);

}


export default router;

