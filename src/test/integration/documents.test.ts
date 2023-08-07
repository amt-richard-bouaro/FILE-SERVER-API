import fs from 'fs';
import jwt from 'jsonwebtoken';
import supertest from "supertest"
import createServer from "../../utils/server";
import { SERVER_CONFIG } from '../../config';
import { USERS, doc } from './database';


const app = createServer();


describe('GET /api/documents', () => {

    describe('when the client request documents and client is authenticated', () => {
        it('should return json object with status 200 - OK', async () => {

            const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data')
        })


    })

    describe('when the client request documents and client is not authenticated', () => {
        it('should return json object with status 401 - UNAUTHORIZED', async () => {

            // No cookie set
            const res = await supertest(app)
                .get(`/api/documents`)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data')
        })


    })

});

describe('GET /api/documents/recent/documents', () => {
    describe('when the client request recent documents and client is authenticated', () => {
        it('should return json object with status 200 - OK', async () => {

            const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents/recent/documents`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data')
        })


    })

    describe('when the client request recent documents and client is not authenticated', () => {
        it('should return json object with status 401 - UNAUTHORIZED', async () => {

            // No cookie set
            const res = await supertest(app)
                .get(`/api/documents/recent/documents`)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data')
        })


    })

});

describe('GET /api/documents/:_id', () => {
    describe('when the client is not authenticated', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            // No cookie set
            const res = await supertest(app)
                .get(`/api/documents/${doc}`)

            expect(res.statusCode).toEqual(401)
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data')
        })
    })

    describe('when the client is authenticated but document does not exist', () => {
        it('should return status 400', async () => {

            const docID = '20932-ninc-32939-3niidl-2hde73v'

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents/${docID}`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(400)
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data')

        })
    })
    describe('when the client is authenticated and document does exist', () => {
        it('should return status 200', async () => {

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents/${doc}`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(200)
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveProperty('_id')

        })
    })
});

//   describe('GET /api/documents/download/:_id', () => {
//         describe('when the client is not authenticated', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const res = await supertest(app)
//                     .get(`/api/documents/download/${doc}`)

//                 expect(res.statusCode).toEqual(401)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//             })
//         })

//         describe('when the client is authenticated but document does not exist', () => {
//             it('should return status 404', async () => {

//                 const docID = '20932-ninc-32939-3niidl-2hde73v'

//                 const token = jwt.sign( USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .get(`/api/documents/download/${docID}`)
//                     .set('Cookie', [`token=${token}`])

//                 expect(res.statusCode).toEqual(404)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data')

//             })
//         })
//         describe('when the client is authenticated and document does exist', () => {
//             it('should return status 200', async () => {

//                 const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .get(`/api/documents/download/${doc}`)
//                     .set('Cookie', [`token=${token}`])

//                 expect(res.statusCode).toEqual(200)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('application/'));

//             })
//         })


//     })

// describe('GET /api/documents/email/:_id', () => {
//     describe('when the client is not authenticated', () => {
//         it('should return status 401 - UNAUTHORIZED', async () => {

//             // NO cookie set
//             const res = await supertest(app)
//                 .get(`/api/documents/email/${doc}`)

//             expect(res.statusCode).toEqual(401)
//             expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//             expect(res.body).toHaveProperty('type', 'error');
//         })
//     })

//     describe('when the client is authenticated but document does not exist', () => {
//         it('should return status 404', async () => {

//             const docID = '20932-ninc-32939-3niidl-2hde73v'

//             const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
//                 expiresIn: '7d',
//             });

//             const res = await supertest(app)
//                 .get(`/api/documents/email/${docID}`)
//                 .set('Cookie', [`token=${token}`])

//             expect(res.statusCode).toEqual(404)
//             expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//             expect(res.body).toHaveProperty('type', 'error');
//             expect(res.body).not.toHaveProperty('data')

//         })
//     })

//     describe('when the client is authenticated and document does exist', () => {
//         it('should return status 200', async () => {

//             const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
//                 expiresIn: '7d',
//             });

//             const res = await supertest(app)
//                 .get(`/api/documents/email/${doc}`)
//                 .set('Cookie', [`token=${token}`])

//             expect(res.statusCode).toEqual(200)
//             expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//             expect(res.body).toHaveProperty('type', 'success');

//         })
//     })

// });

describe('PUT /api/documents/update/:_id', () => {

    describe('when the client is authenticated as not admin', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            const requestBody = {
                title: 'new title',
                description: 'new description',
            };

            const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });


            const res = await supertest(app)
                .put(`/api/documents/update/${doc}`)
                .set('Cookie', [`token=${token}`])
                .send(requestBody)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');
        })

    })

    describe('when the client is authenticated as admin and provides valid data', () => {
        it('should return status 200 - OK', async () => {

            const requestBody = {
                title: 'new title',
                description: 'new description',
            };

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });


            const res = await supertest(app)
                .put(`/api/documents/update/${doc}`)
                .set('Cookie', [`token=${token}`])
                .send(requestBody)

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data');
        })

    })

    describe('when the client is not authenticated', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            const requestBody = {
                title: 'new title',
                description: 'new description',
            };

            const res = await supertest(app)
                .put(`/api/documents/update/${doc}`)
                .send(requestBody)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');

        })

    })

    describe('when the client is authenticated but provide invalid data', () => {
        it('should return status 400 - BAD REQUEST', async () => {

            const requestBodies = [{
                title: '',
                description: 'new description',
            }, {
                description: 'new description',
            },
            {
                title: 'new title',
            },
            {
                title: 'new title',
                description: '',
            },
            {}// empty request body
            ];

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });


            for (const requestBody of requestBodies) {

                const res = await supertest(app)
                    .put(`/api/documents/update/${doc}`)
                    .set('Cookie', [`token=${token}`])
                    .send(requestBody)

                expect(res.statusCode).toEqual(400);
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data');

            }




        })

    })


    describe('when the client is authenticated but provide invalid document _id', () => {
        it('should return status 400 - BAD REQUEST', async () => {

            const requestBody = {
                title: 'new title',
                description: 'new description',
            }

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });


            const wrongDocID = '9jjewew-ne82n-nwepwt-uwp23-vweie'

            const res = await supertest(app)
                .put(`/api/documents/update/${wrongDocID}`)
                .set('Cookie', [`token=${token}`])
                .send(requestBody)

            expect(res.statusCode).toEqual(400);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');

        })

    })

});

describe('POST /api/documents/search', () => {

    describe('when the client is not authenticated', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            const requestBody = {
                search: 'new title',
            };

            // No cookie set
            const res = await supertest(app)
                .post(`/api/documents/search`)
                .send(requestBody)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');
        })

    })

    describe('when the client is authenticated and provides valid data', () => {
        it('should return status 200 - OK', async () => {

            const requestBody = {
                search: 'new title',
            };

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });


            const res = await supertest(app)
                .post(`/api/documents/search`)
                .set('Cookie', [`token=${token}`])
                .send(requestBody)

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data');
        })

    })
     
});

describe('GET /api/documents/stats', () => {

    describe('when the client is not authenticated', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            const res = await supertest(app)
                .post(`/api/documents/search`)

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');
        })

    });

    describe('when the client is authenticated not as admin', () => {
        it('should return status 401 - UNAUTHORIZED', async () => {

            const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents/stats`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(401);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'error');
            expect(res.body).not.toHaveProperty('data');
        })

    });

    describe('when the client is authenticated as admin', () => {
        it('should return status 200 - OK', async () => {

            const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
                expiresIn: '7d',
            });

            const res = await supertest(app)
                .get(`/api/documents/stats`)
                .set('Cookie', [`token=${token}`])

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            expect(res.body).toHaveProperty('type', 'success');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('folders');
            expect(res.body.data).toHaveProperty('performing');
            expect(res.body.data).toHaveProperty('avg_file_size');
        })

    });
});

// describe('POST /api/documents/upload', () => {

//         describe('when the client provides valid information', () => {
//             it('should return status 201 - CREATED', async () => {


//                 const file = fs.readFileSync('src/test/integration/LCF-31516-tut.pdf');

//                 const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .post('/api/documents/upload')
//                     .set('Cookie', [`token=${token}`])
//                     .field('title', 'New Document')
//                     .field('description', 'New description')
//                     .attach('document', file, 'uploadtest.pdf');
//                 expect(res.statusCode).toEqual(201)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
//                 expect(res.body).toHaveProperty('data')
//                 expect(res.body.data).toHaveProperty('_id')
//                 expect(res.body.data).toHaveProperty('downloaded_count', 0)
//                 expect(res.body.data).toHaveProperty('emailed_count', 0);

//                 const doc_id = res.body.data._id

//                 await supertest(app)
//                     .delete(`/api/documents/destroy/${doc_id}`)
//                     .set('Cookie', [`token=${token}`])

//             });
//         });
//         describe('when the client provides invalid information', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const file = fs.readFileSync('src/test/integration/LCF-31516-tut.pdf');

//                 const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });
 
//                 const res = await supertest(app)
//                     .post('/api/documents/upload')
//                     .set('Cookie', [`token=${token}`])
//                     .field('description', 'New description')
//                     .attach('document', file, 'uploadtest.pdf');
                    
//                 expect(res.statusCode).toEqual(400)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
//                 expect(res.body).toHaveProperty('type', 'error')
//                 expect(res.body).not.toHaveProperty('data')
//             });


//             it('should return status 400 - BAD REQUEST for missing file', async () => {

//                 const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });
         
//                     const res = await supertest(app)
//                     .post('/api/documents/upload')
//                     .set('Cookie', [`token=${token}`])
//                     .field('title', 'New title')
//                     .field('description', 'New description')
                                     
//                 expect(res.statusCode).toEqual(400)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
//                 expect(res.body).toHaveProperty('type', 'error')
//                 expect(res.body).not.toHaveProperty('data')
                    
//             });
//         });

//     })


//   describe('DELETE /api/documents/destroy/:_id', () => {
//         describe('when the client is not authenticated', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const res = await supertest(app)
//                     .delete(`/api/documents/destroy/${doc}`)

//                 expect(res.statusCode).toEqual(401)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data')
//             })
//         })

//         describe('when the client is authenticated but document does not exist', () => {
//             it('should return status 400', async () => {

//                 const docID = '20932-ninc-32939-3niidl-2hde73v'

//                 const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .delete(`/api/documents/destroy/${docID}`)
//                     .set('Cookie', [`token=${token}`])

//                 expect(res.statusCode).toEqual(400)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data')

//             })
//         })
//         describe('when the client is authenticated and document does exist', () => {
//             it('should return status 200', async () => {

//                 const token = jwt.sign(USERS.admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

              
//                 const res = await supertest(app)
//                     .get(`/api/documents/${doc}`)
//                     .set('Cookie', [`token=${token}`])

//                 expect(res.statusCode).toEqual(200)
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).toHaveProperty('data')
//                 expect(res.body.data).toHaveProperty('_id')

//             })
//         })


//     })