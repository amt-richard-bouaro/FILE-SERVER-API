import { pool }from '../../Database/db'


describe('Postgres DB Connection', () => {
  it('should establish a successful pg db connection', async () => {
   
    const client = await pool.connect();

    expect(process.env.NODE_ENV).toBe('test');
    expect(client).toBeTruthy();

    client.release();
  });
});