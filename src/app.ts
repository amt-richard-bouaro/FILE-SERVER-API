import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerDocs from './utils/swagger';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/')));

import { SERVER_CONFIG } from './config';
const PORT = SERVER_CONFIG.PORT;

swaggerDocs(app, PORT as number);
 
import api from './Endpoints/default';
app.use('/api', api);



import doc from './Endpoints/Document/root';
app.use('/api/documents', doc);

import user from './Endpoints/User/root';
app.use('/api/users', user);

import { notFoundError, errorHandler } from './Middlewares/errors';



app.use(notFoundError);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
   
})

