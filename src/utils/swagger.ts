import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { STATUS } from '../config';




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
    customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js',

}


export const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {


    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(STATUS.OK).json(swaggerSpec);
    })

    console.log(`Docs available at https://file-server-api.vercel.app/api/docs`);

}


export default swaggerDocs;

