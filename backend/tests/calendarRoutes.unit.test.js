const request = require('supertest'); 
const server = require('../server.js'); 
const mongoose = require('mongoose');

describe('Calendar Routes', () => {
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
    it('getDaysInCurrentMonth', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra123"
            })
            .then(async (response) => {
                const res = await request(server)
                    .get('/api/calendar/getDaysInCurrentMonth')
                    .set('Cookie', [response.headers['set-cookie'][0]]);
                expect(res.body.currentDay).toEqual(new Date().getDate());
            });
    });
    it('getDaysInNextMonth', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "sifra123"
            })
            .then(async (response) => {
                const res = await request(server)
                    .post('/api/calendar/getNextMonth')
                    .send({
                        month: 5, 
                        year: 2022
                    })
                    .set('Cookie', [response.headers['set-cookie'][0]]);
                expect(res.body.nextMonthName).toEqual('Jun');
            });
    });
});