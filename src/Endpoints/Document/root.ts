import express from 'express';
import { upload } from './controllers/upload';
import { authenticate } from '../../Middlewares/authenticate';
import { docUpload } from '../../utils/fileUploader';
import { getDocuments } from './controllers/getDocuments';
import { getDocument } from './controllers/getDocument';
import { destroyDocument } from './controllers/destroyDocument';
import { updateDocument } from './controllers/updateDocument';
import { searchDocuments } from './controllers/searchDocuments';
import { getDocumentsStats } from './controllers/documentsStat';
import { downloadDocuments } from './controllers/downloadDocument';
import { emailDocuments } from './controllers/emailDocument';
import { getRecents } from './controllers/recents';

const app = express.Router();


app.get('/', authenticate, getDocuments);

app.post('/upload', authenticate, docUpload.single('document'), upload);

app.delete('/destroy/:_id', authenticate, destroyDocument);

app.put('/update/:_id', authenticate, updateDocument);

app.post('/search', authenticate, searchDocuments);

app.get('/stats', authenticate, getDocumentsStats);

app.get('/download/:_id', authenticate, downloadDocuments);

app.get('/recent/documents', authenticate, getRecents);

app.get('/email/:_id',authenticate, emailDocuments);

app.get('/:_id', authenticate, getDocument);





export default app;