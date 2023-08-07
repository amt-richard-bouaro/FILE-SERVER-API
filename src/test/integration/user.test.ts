import jwt from 'jsonwebtoken';
import supertest from "supertest"
import createServer from "../../utils/server";
import { SERVER_CONFIG } from '../../config';
import pool from '../../Database/db'
import { initiateDatabase, dropTables, USERS } from './database';


const app = createServer();



    beforeAll(async () => {
        //create test database
        await pool.query({
            text: initiateDatabase,
            values: []
        })


    });

    afterAll(async () => {
        //create test database
        await pool.query({
            text: dropTables,
            values: []
        })


    });

    describe('GET /api/users/auth', () => {
        describe('when the client request for authentication', () => {
            it('should return status 200 - OK => for successful authentication', async () => {

                const user = {
                    email: "ghetrich370555@gmail.com",
                    password: "password"
                }

                await supertest(app)
                    .post(`/api/users/auth`)
                    .send(user)
                    .expect(200)
            }),
                it('should return status 401 - UNAUTHORIZED for invalid credentials', async () => {

                    const user = {
                        email: "whois@ama.co",
                        password: "simplepassword"
                    }

                    await supertest(app)
                        .post(`/api/users/auth`)
                        .send(user)
                        .expect(401)
                })

        })

    })

    describe('GET /api/users/:_id', () => {

        describe('when the client is not authenticated', () => {
            it.only('should return status 401 - UNAUTHORIZED', async () => {

                // ID does not exist
                const userID = '20932-ninc-32939-3niidl-2hde73v'

                // Client is not authenticated - not cookie set
                const res = await supertest(app)
                    .get(`/api/users/${userID}`);
                
                console.log(res);
                
                
                expect(res.statusCode).toEqual(401)
            })
        })

        describe('when the user does not exist', () => {
            it('should return status 400', async () => {

                // ID does not exist
                const userID = '20932-ninc-32939-3niidl-2hde73v'

                const user = {
                    _id: '0093d-maie9-32dsyd9-32323dl-ahde0393'
                }

                const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });
                // Cookie is set but user does not exist
                await supertest(app)
                    .get(`/api/users/${userID}`)
                    .set('Cookie', [`token=${token}`])
                    .expect(400)
            })
        })

        describe('when the user exist', () => {
            it('should return status 400', async () => {

                const token = jwt.sign(USERS.user, SERVER_CONFIG.JWT_SECRET, {
                    expiresIn: '7d',
                });
                // Cookie is set - implying that user is authenticated
                await supertest(app)
                    .get(`/api/users/${USERS.user._id}`)
                    .set('Cookie', [`token=${token}`])
                    .expect(200)
            })
        })

    })
