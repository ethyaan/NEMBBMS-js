import supertest from 'supertest';
import app from '../../app.js';
import { describe } from 'jest-circus';
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

    test('POST /user raise validation error', async () => {
        const duplicateUser = await request.post('/user').send();

        expect(duplicateUser.status).toBe(422);
        expect(duplicateUser.body).toHaveProperty('errors');
    });

    /**
        * positive scenario - depeneded on previous test actions
        */
    test('POST /user/resendVerification update user verification code', async () => {
        const vUser = await request.post('/user/resendVerification').send({ email: newUserData.email });

        expect(vUser.status).toBe(200);
        expect(vUser.body).toHaveProperty('status');
        expect(vUser.body).toHaveProperty('verificationCodeDate');
        expect(vUser.body.status).toEqual('success');
    });

    /**
     * negative scenario
     */
    test('POST /user/resendVerification fail to update user verification code for not existing user', async () => {

        const vUser = await request.post('/user/resendVerification').send({ email: 'noExists@user.com' });
        expect(vUser.status).toBe(200);
        expect(vUser.body).toHaveProperty('status');
        expect(vUser.body.status).toEqual('failed');
    });

    test('POST /user/resendVerification should fail due to input validation', async () => {
        const vUser = await request.post('/user/resendVerification').send();
        expect(vUser.status).toBe(422);
        expect(vUser.body).toHaveProperty('errors');
    });


    // below need to be implemented
    // '/verify'
    // '/login'
    // '/changePassword'
    // '/updateProfile'
    // '/forgetPassword'
    // '/setNewPassword'
    // '/getProfile'
});
