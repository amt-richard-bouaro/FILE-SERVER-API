import fs from 'fs';
import jwt from 'jsonwebtoken';
import supertest from "supertest"
import createServer from "../../utils/server";
import { SERVER_CONFIG } from '../../config';



const app = createServer();
const USERS: {
    user: {
        _id: string;
    },
    userMustChangePassword: {
        _id: string;
    }
    , admin: {
        _id: string;
    }, adminMustChangePassword: {
        _id: string;
    }
} = {
    user: { _id: 'fc8f754b-9947-4261-8c86-cbcda371ff54' },
    userMustChangePassword: { _id: '7d3f02e8-5737-48aa-96e2-d6b585b5257d' },
    admin: { _id: '1abd52de-d7b5-48e9-b03b-be56ab07eb2a' },
    adminMustChangePassword: { _id: 'e3eed61f-a296-4273-ba0e-89dcdac2002d' }
}

const doc = 'c28b4d7b-9a4c-4db5-a8b7-7de869b8a826'

describe('Test Documents Controllers', () => {

    describe('GET /api/documents', () => {
        describe('when the client request documents and client is authenticated', () => {
            it('should return json object with status 200 - OK', async () => {

                const user = USERS.user

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
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

        describe('when the client request documents and client is notauthenticated', () => {
            it('should return json object with status 401 - UNAUTHORIZED', async () => {

                const res = await supertest(app)
                    .get(`/api/documents`)

                expect(res.statusCode).toEqual(401);
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')
            })


        })

    })
    describe('GET /api/documents/recent/documents', () => {
        describe('when the client request recent documents and client is authenticated', () => {
            it('should return json object with status 200 - OK', async () => {

                const user = USERS.user

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
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

                const res = await supertest(app)
                    .get(`/api/documents/recent/documents`)

                expect(res.statusCode).toEqual(401);
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')
            })


        })

    })

    describe('GET /api/documents/:_id', () => {
        describe('when the client is not authenticated', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

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

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
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

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
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


    })
    describe('GET /api/documents/download/:_id', () => {
        describe('when the client is not authenticated', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

                const res = await supertest(app)
                    .get(`/api/documents/download/${doc}`)

                expect(res.statusCode).toEqual(401)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
            })
        })

        describe('when the client is authenticated but document does not exist', () => {
            it('should return status 404', async () => {

                const docID = '20932-ninc-32939-3niidl-2hde73v'

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

                const res = await supertest(app)
                    .get(`/api/documents/download/${docID}`)
                    .set('Cookie', [`token=${token}`])

                expect(res.statusCode).toEqual(404)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')

            })
        })
        describe('when the client is authenticated and document does exist', () => {
            it('should return status 200', async () => {

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

                const res = await supertest(app)
                    .get(`/api/documents/download/${doc}`)
                    .set('Cookie', [`token=${token}`])

                expect(res.statusCode).toEqual(200)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('application/'));


            })
        })


    })
    describe('GET /api/documents/email/:_id', () => {
        describe('when the client is not authenticated', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

                const res = await supertest(app)
                    .get(`/api/documents/email/${doc}`)

                expect(res.statusCode).toEqual(401)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
            })
        })

        describe('when the client is authenticated but document does not exist', () => {
            it('should return status 404', async () => {

                const docID = '20932-ninc-32939-3niidl-2hde73v'

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

                const res = await supertest(app)
                    .get(`/api/documents/email/${docID}`)
                    .set('Cookie', [`token=${token}`])

                expect(res.statusCode).toEqual(404)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')

            })
        })
        describe('when the client is authenticated and document does exist', () => {
            it('should return status 200', async () => {

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

                const res = await supertest(app)
                    .get(`/api/documents/email/${doc}`)
                    .set('Cookie', [`token=${token}`])

                expect(res.statusCode).toEqual(200)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'success');


            })
        })


    })


    describe('PUT /api/documents/update/:_id', () => {

        describe('when the client is authenticated as not admin', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

                const requestBody = {
                    title: 'new title',
                    description: 'new description',
                };
                const authUser = USERS.user;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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
                const authUser = USERS.admin;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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
                const authUser = USERS.admin

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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

                const authUser = USERS.admin

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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

    })
    describe('POST /api/documents/search', () => {

        describe('when the client is not authenticated', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

                const requestBody = {
                    search: 'new title',
                };

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
                const authUser = USERS.user;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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
    })
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

        })

        describe('when the client is authenticated as not admin', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {


                const authUser = USERS.user;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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

        })

        describe('when the client is authenticated as admin', () => {
            it('should return status 200 - OK', async () => {


                const authUser = USERS.admin;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
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

        })
    })

    describe('POST /api/documents/upload', () => {

        describe('when the client provides valid information', () => {
            it('should return status 201 - CREATED', async () => {


                const file = fs.readFileSync('src/__tests__/controllers/LCF-31516-tut.pdf');
                const authUser = USERS.admin;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });


                const res = await supertest(app)
                    .post('/api/documents/upload')
                    .set('Cookie', [`token=${token}`])
                    .field('title', 'New Document')
                    .field('description', 'New description')
                    .attach('document', file, 'uploadtest.pdf');
                expect(res.statusCode).toEqual(201)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(res.body).toHaveProperty('data')
                expect(res.body.data).toHaveProperty('_id')
                expect(res.body.data).toHaveProperty('downloaded_count', 0)
                expect(res.body.data).toHaveProperty('emailed_count', 0)



            });
        });
        describe('when the client provides invalid information', () => {
            it('should return status 400 - BAD REQUEST', async () => {


                const file = fs.readFileSync('src/__tests__/controllers/LCF-31516-tut.pdf');
                const authUser = USERS.admin;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

              
                   
                    const res = await supertest(app)
                    .post('/api/documents/upload')
                    .set('Cookie', [`token=${token}`])
                    .field('description', 'New description')
                    .attach('document', file, 'uploadtest.pdf');
                    
                expect(res.statusCode).toEqual(400)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(res.body).toHaveProperty('type', 'error')
                expect(res.body).not.toHaveProperty('data')
                    

            

                
               



            });
            it('should return status 400 - BAD REQUEST for missing file', async () => {


                const file = fs.readFileSync('src/__tests__/controllers/LCF-31516-tut.pdf');
                const authUser = USERS.admin;

                const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

              
                   
                    const res = await supertest(app)
                    .post('/api/documents/upload')
                    .set('Cookie', [`token=${token}`])
                    .field('title', 'New title')
                    .field('description', 'New description')
                                     
                expect(res.statusCode).toEqual(400)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(res.body).toHaveProperty('type', 'error')
                expect(res.body).not.toHaveProperty('data')
                    

            

                
               



            });
        });





    })

    describe('DELETE /api/documents/destroy/:_id', () => {
        describe('when the client is not authenticated', () => {
            it('should return status 401 - UNAUTHORIZED', async () => {

                const res = await supertest(app)
                    .delete(`/api/documents/destroy/${doc}`)

                expect(res.statusCode).toEqual(401)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')
            })
        })

        describe('when the client is authenticated but document does not exist', () => {
            it('should return status 400', async () => {

                const docID = '20932-ninc-32939-3niidl-2hde73v'

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });

                const res = await supertest(app)
                    .delete(`/api/documents/destroy/${docID}`)
                    .set('Cookie', [`token=${token}`])

                expect(res.statusCode).toEqual(400)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(res.body).toHaveProperty('type', 'error');
                expect(res.body).not.toHaveProperty('data')

            })
        })
        describe('when the client is authenticated and document does exist', () => {
            it('should return status 200', async () => {

                const user = USERS.admin

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
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


    })


})