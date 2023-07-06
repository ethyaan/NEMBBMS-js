import supertest from 'supertest';
import app from '../../app.js';
import config from '../../config.js';
import { describe } from 'jest-circus';
const request = supertest(app);
import { ModelFactory } from '../../common/index.js';
import { UserModel } from './schema.js';

const _pawssword = 'A7_c1UzPO.rO';
const newUserData = {
    email: 'sample@example.com',
    name: 'Ethan',
    lastName: 'Ethyaan',
    password: _pawssword,
    captcha: 'xxx'
};
const userModel = new ModelFactory(UserModel);

describe('User Module', () => {

    /**
     * positive scenario
     * will not check Recaptcha & will not send any email
     */
    test('POST /user should create a new user', async () => {
        const req = await request.post('/user').send(newUserData);

        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('username');
        expect(req.body).toHaveProperty('verificationCodeDate');
    });

    /**
     * negative scenario
     * will check for duplication
     */
    test('POST /user raise duplication error', async () => {
        const req = await request.post('/user').send(newUserData);

        expect(req.status).toBe(422);
        expect(req.body).toHaveProperty('errorMessage');
        expect(req.body.errorMessage).toEqual('user Already Registered.');
    });

    test('POST /user raise validation error', async () => {
        const req = await request.post('/user').send();

        expect(req.status).toBe(422);
        expect(req.body).toHaveProperty('errors');
    });

    /**
        * positive scenario - depeneded on previous test actions
        */
    test('POST /user/resendVerification update user verification code', async () => {
        const req = await request.post('/user/resendVerification').send({ email: newUserData.email });

        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body).toHaveProperty('verificationCodeDate');
        expect(req.body.status).toEqual('success');
    });

    /**
     * negative scenario
     */
    test('POST /user/resendVerification fail to update user verification code for not existing user', async () => {
        const req = await request.post('/user/resendVerification').send({ email: 'noExists@user.com' });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('failed');
    });

    test('POST /user/resendVerification should fail due to input validation', async () => {
        const req = await request.post('/user/resendVerification').send();
        expect(req.status).toBe(422);
        expect(req.body).toHaveProperty('errors');
    });

    test('POST /user/resendVerification should fail because user is already verified', async () => {
        const userInfo = await userModel.findEntityByParams({ email: newUserData.email });
        await userModel.updateEntityByModel(userInfo, { verified: true });
        const req = await request.post('/user/resendVerification').send({ email: newUserData.email });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('failed');
        await userModel.updateEntityByModel(userInfo, { verified: false });
    });

    /**
     * negative scenarios
     */
    test('POST /user/verify/ should fail due to input validation', async () => {
        const req = await request.get('/user/verify/uwjdyuwjk').send();
        expect(req.status).toBe(302);
        expect(req.headers).toHaveProperty('location');
        expect(req.headers.location).toEqual(`${config.APP_FRONT}/confirmation/failed`);
    });

    /**
     * positive scenario
     */
    test('POST /user/verify/ should verify the user', async () => {
        const { verificationCode } = await userModel.findEntityByParams({ email: newUserData.email });
        const req = await request.get(`/user/verify/${verificationCode}`).send();
        expect(req.status).toBe(302);
        expect(req.headers).toHaveProperty('location');
        expect(req.headers.location).toEqual(`${config.APP_FRONT}/confirmation/success`);
    });

    /**
     * negative scenarios
     */
    test('POST /user/forgetPassword should fail submit request', async () => {
        const req = await request.post(`/user/forgetPassword`).send();
        expect(req.status).toBe(422);
        expect(req.body).toHaveProperty('errors');
    });

    test('POST /user/forgetPassword should fail submit request', async () => {
        const req = await request.post(`/user/forgetPassword`).send({ email: 'noSuch@user.com' });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('failed');
    });

    test('POST /user/forgetPassword should successfully submit request', async () => {
        const req = await request.post(`/user/forgetPassword`).send({ email: newUserData.email });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('success');
    });

    /**
     * negative scenarios
     */
    test('POST /user/setNewPassword should fail submit request', async () => {
        const req = await request.post(`/user/setNewPassword`).send();
        expect(req.status).toBe(422);
        expect(req.body).toHaveProperty('errors');
    });

    test('POST /user/setNewPassword should fail submit request', async () => {
        const req = await request.post(`/user/setNewPassword`).send({ email: 'wrong@email.com', code: 'wrong_Code', password: 'abcd1234' });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('failed');
        expect(req.body).toHaveProperty('message');
        expect(req.body.message).toEqual('user does not exists');
    });

    test('POST /user/setNewPassword should fail submit request', async () => {
        const req = await request.post(`/user/setNewPassword`).send({ email: newUserData.email, code: 'WrongCode', password: 'abcd1234' });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('failed');
        expect(req.body).toHaveProperty('message');
        expect(req.body.message).toEqual('invalid or expired request');
    });

    /**
     * positive scenario
     */
    test('POST /user/setNewPassword should successfully submit request', async () => {
        const { verificationCode } = await userModel.findEntityByParams({ email: newUserData.email });
        const req = await request.post(`/user/setNewPassword`).send({ email: newUserData.email, code: verificationCode, password: 'abcd1234' });
        expect(req.status).toBe(200);
        expect(req.body).toHaveProperty('status');
        expect(req.body.status).toEqual('success');
    });


    // below need to be implemented

    // '/login'

    // '/changePassword'

    // '/updateProfile'

    // '/getProfile'
});
