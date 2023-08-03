import express from 'express';
import { SERVER_CONFIG } from '../config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import api from '../Endpoints/default';
import doc from '../Endpoints/Document/root';
import user from '../Endpoints/User/root';
import { notFoundError, errorHandler } from '../Middlewares/errors';
import swaggerDocs, { swaggerSpec } from './swagger';

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

    app.use(express.json());
    app.use(cookieParser());


    
const PORT = SERVER_CONFIG.PORT;




    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.3.1/swagger-ui.min.css',
        customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.3.1/swagger-ui-bundle.min.js',
    }));

app.use('/api/documents', doc);


app.use('/api/users', user);

app.use('/api', api);

    
swaggerDocs(app, PORT as number);
    
app.use(notFoundError);
app.use(errorHandler);
    
    return app;
}


export default createServer;

