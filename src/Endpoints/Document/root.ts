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
import { restrictedToAdmin } from '../../Middlewares/accessRestriction';

const app = express.Router();

/**
 * @openapi
 * /api/documents:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get all documents
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: Documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Documents'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/', authenticate, getDocuments);
/**
 * @openapi
 * /api/documents/upload:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Upload new document
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               document:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - description
 *               - document
 *     responses:
 *       201:
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       400:
 *         description: BAD REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Validation_Error_Response'
 *                 - $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */ 
app.post('/upload', authenticate,restrictedToAdmin, docUpload.single('document'), upload);

/**
 * @openapi
 * /api/documents/destroy/{_id}:
 *   delete:
 *     tags:
 *       - Documents
 *     summary: Delete a particular document
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Document to delete
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: DELETED DOCUMENT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.delete('/destroy/:_id', authenticate,restrictedToAdmin, destroyDocument);

/**
 * @openapi
 * /api/documents/update/{_id}:
 *   put:
 *     tags:
 *       - Documents
 *     summary: Modify document information
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Document to modify
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: MODIFIED DOCUMENT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: BAD REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.put('/update/:_id', authenticate,restrictedToAdmin, updateDocument);
/**
 * @openapi
 * /api/documents/search:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Search for documents
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *             required:
 *               - search
 *     responses:
 *       200:
 *         description: MATCHED DOCUMENTS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Documents'
 *       400:
 *         description: BAD REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.post('/search', authenticate, searchDocuments);

/**
 * @openapi
 * /api/documents/stats:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get stats on documents
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: Docuuments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Document_Stats'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/stats', authenticate,restrictedToAdmin, getDocumentsStats);

/**
 * @openapi
 * /api/documents/download/{_id}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Download a particular document
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Document to download
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: DOCUMENT READY
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/download/:_id', authenticate, downloadDocuments);

/**
 * @openapi
 * /api/documents/recent/documents:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get all documents actives by a specific user
 *     parameters:
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: Documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Documents'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/recent/documents', authenticate, getRecents);

/**
 * @openapi
 * /api/documents/email/{_id}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Email a particular document to a user
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Document to be emailed
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: DOCUMENT SENT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/email/:_id',authenticate, emailDocuments);

/**
 * @openapi
 * /api/documents/{_id}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get a particular document
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Document to retrieve
 *         required: true
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         description: Access token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           httpOnly: true
 *     responses:
 *       200:
 *         description: Document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 *       500:
 *         description: INTERNAL SERVER ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error_Response'
 */
app.get('/:_id', authenticate, getDocument);





export default app;