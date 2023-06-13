"use strict";
import https from 'node:https';
import config from "../config";
import { createErrorObject } from '../common';

class GoogleReCaptchaService {

    constructor() {
        this.URL = `https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_KEY}`;
    }

    /**
     * verify Captcha
     * @param {*} key 
     */
    verifyRecaptcha = async (key) => {
        const url = `${this.URL}&response=${key}`;

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk.toString());
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        if (!!parsedData.success) {
                            return resolve(true);
                        } else {
                            return reject(createErrorObject({ options: { msg: 'verification failed, wrong code', statusCode: 400 } }));

                        }
                    } catch (e) {
                        return reject(createErrorObject({ options: { msg: 'Error in veritifcation', statusCode: 400 } }));
                    }
                });
            });
        });
    }
}
export default new GoogleReCaptchaService();