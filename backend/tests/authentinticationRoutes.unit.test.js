const request = require('supertest'); 
const server = require('../server.js'); 
const mongoose = require('mongoose');

jest.useRealTimers();

afterAll( async () => {
    await mongoose.disconnect();
})

describe('Authentication Routes', () => {
    it('LoginFail', async () => {
        jest.setTimeout(10 * 2000);
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra1234"
            });
        expect(res.body.message).toEqual("Pogrešna lozinka ili email!");
    }, 20000);
    it('LoginSuccessed', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra123"
            });
        expect(res.body.message).toEqual("Uspješno ste se prijavili!");
    });
    it('Admin role authorization', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra123"
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
                password: "sifra123"
            })
            .then(async (response) => {
                const res = await request(server)
                    .get('/api/auth/loggedIn')
                    .set('Cookie', [response.headers['set-cookie'][0]] );
                expect(res.body).toEqual(true);
            });
    });
    it('LogOut', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra123"
            })
            .then(async (response) => {
                const res = await request(server)
                    .delete('/api/auth/logout')
                    .set('Cookie', [response.headers['set-cookie'][0]] );
                expect(res.body.message).toEqual("Uspješno ste se odjavili!");
            });
    });
});