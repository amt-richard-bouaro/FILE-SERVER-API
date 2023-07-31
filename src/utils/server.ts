import express from 'express';
import { SERVER_CONFIG } from '../config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import api from '../Endpoints/default';
import doc from '../Endpoints/Document/root';
import user from '../Endpoints/User/root';
import { notFoundError, errorHandler } from '../Middlewares/errors';
import swaggerDocs from './swagger';

function createServer() {

  


    const app = express();

    app.use(
        cors({
            origin: function (origin, callback) {
                if (origin && SERVER_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            },
            credentials: true,
        })
    );

    app.use(express.json());
    app.use(cookieParser());

app.get('/', (req, res) => {
  return res.status(200).json({apiVersion: '1.0.0'});
})
    
const PORT = SERVER_CONFIG.PORT;

swaggerDocs(app, PORT as number);
 

app.use('/api', api);


app.use('/api/documents', doc);


app.use('/api/users', user);


app.use(notFoundError);
app.use(errorHandler);
    
    return app;
}


export default createServer;