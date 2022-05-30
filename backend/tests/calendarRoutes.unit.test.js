const request = require('supertest'); 
const server = require('../server.js'); 
const calendarRoutes = require('../routes/calendarRoutes');

describe('Calendar Routes', () => {
    it('getDaysInCurrentMonth', async () => {
        await request(server)
            .post('/api/auth/login')
            .send({
                email: "tkulosmano996@gmail.com",
                password: "oorochooG2au"
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
                password: "oorochooG2au"
            })
            .then(async (response) => {
                const res = await request(server)
                    .get('/api/calendar/getDaysInCurrentMonth')
                    .set('Cookie', [response.headers['set-cookie'][0]]);
                expect(res.body.currentDay).toEqual(new Date().getDate());
            });
    });
});