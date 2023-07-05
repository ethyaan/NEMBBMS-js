import supertest from 'supertest';
import app from '../../app.js';
const request = supertest(app);

const _pawssword = 'A7_c1UzPO.rO';
const newUserData = {
    email: 'sample@example.com',
    name: 'Ethan',
    lastName: 'Ethyaan',
    password: _pawssword,
    captcha: 'xxx'
};

describe('User Module', () => {

    /**
     * positive scenario
     * will not check Recaptcha & will not send any email
     */
    test('POST /user should create a new user', async () => {
        const newUser = await request.post('/user').send(newUserData);

        expect(newUser.status).toBe(200);
        expect(newUser.body).toHaveProperty('username');
        expect(newUser.body).toHaveProperty('verificationCodeDate');
    });

    /**
     * negative scenario
     * will check for duplication
     */
    test('POST /user raise duplication error', async () => {
        const duplicateUser = await request.post('/user').send(newUserData);

        expect(duplicateUser.status).toBe(422);
        expect(duplicateUser.body).toHaveProperty('errorMessage');
        expect(duplicateUser.body.errorMessage).toEqual('user Already Registered.');
    });

    // below need to be implemented

    // '/resendVerification'
    // '/verify'
    // '/login'
    // '/changePassword'
    // '/updateProfile'
    // '/forgetPassword'
    // '/setNewPassword'
    // '/getProfile'
});
