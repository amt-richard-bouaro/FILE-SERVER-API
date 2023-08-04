import express from 'express';
import { SERVER_CONFIG } from '../config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import api from '../Endpoints/default';
import doc from '../Endpoints/Document/root';
import user from '../Endpoints/User/root';
import { notFoundError, errorHandler } from '../Middlewares/errors';
import swaggerDocs, { customOptions, swaggerSpec } from './swagger';

function createServer() {

    const app = express();

    app.use(
        cors({
            origin: function (origin, callback) {
                if (origin && SERVER_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
                    callback(null, true);

                } else {

                    // console.log('Cors rejection origin:' + origin);  

                    callback(null, false);
                }
            },
            credentials: true,
        })
    );


    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());



    const PORT = SERVER_CONFIG.PORT;

    

    app.use('/api/documents', doc);


    app.use('/api/users', user);

    app.use('/api', api);

    app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    swaggerDocs(app, PORT as number);

    app.use(notFoundError);
    app.use(errorHandler);

    return app;
}


export default createServer;

