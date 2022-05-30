const request = require('supertest'); 
const server = require('../server.js'); 
const authenticationRoutes = require('../routes/authenticationRoutes');

describe('Authentication Routes', () => {
    it('LoginFail', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochoog2Au"
            });
        expect(res.body.message).toEqual("Pogrešna lozinka ili email!");
    });
    it('LoginSuccessed', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochooG2au"
            });
        expect(res.body.message).toEqual("Uspješno ste se prijavili!");
    });
    it('LogOut', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochooG2au"
            })
            .then(async (response) => {
                const res = await request(server)
                    .delete('/api/auth/logout')
                    .set('Cookie', [response.headers['set-cookie'][0]] );
                expect(res.body.message).toEqual("Uspješno ste se odjavili!");
            });
    });
    it('Admin role authorization', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochooG2au"
            })
            .then(async (response) => {
                const res = await request(server)
                    .get('/api/auth/roleAuthorization')
                    .set('Cookie', [response.headers['set-cookie'][0]] );
                expect(res.body).toEqual(1);
            });
    });
    it('Is user logged in', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochooG2au"
            })
            .then(async (response) => {
                const res = await request(server)
                    .get('/api/auth/loggedIn')
                    .set('Cookie', [response.headers['set-cookie'][0]] );
                expect(res.body).toEqual(true);
            });
    });
});