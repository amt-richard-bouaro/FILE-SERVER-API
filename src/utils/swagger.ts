import {Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { STATUS } from '../config';



const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'File Server API Documentation',
            version:'1.0.0',
        },
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


export const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {


    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


    app.get('/docs.json', (req:Request, res:Response) => {
        // res.setHeader('Content-Type', 'application/json');
        return res.status(STATUS.OK).json(swaggerSpec);
    })

    console.log(`Docs available at https://file-server-api.vercel.app/api/docs`);
    
}


export default swaggerDocs;

