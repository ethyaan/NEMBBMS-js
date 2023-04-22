import { body } from 'express-validator';
import { V, emailValidator ,mobileValidator, codeValidator, nameValidator, lastNameValidator, passwordValidaotr } from '../../common/index.js';


export default {
    signup: () => {
        return V([emailValidator]);
    },
    resendVerification: () => {
        return V([emailValidator]);
    },
    verify: () => {
        return V([emailValidator, codeValidator]);
    },
    setProfile: () => {
        return V([
            emailValidator,
            codeValidator,
            nameValidator,
            lastNameValidator,
            passwordValidaotr
        ]);
    },
    login: () => {
        return V([emailValidator, passwordValidaotr]);
    },
    changePassword: () => {
        return V([
            passwordValidaotr,
            body('new').exists({ checkFalsy: true, checkNull: true }).withMessage('please enter valid password')
                .isLength({ min: 6 }).withMessage('password must be atleast 6 character')
        ]);
    },
    updateProfile: () => {
        return V([nameValidator, lastNameValidator]);
    },
    forgetPassword: () => {
        return V([emailValidator]);
    },
    setNewPassword: () => {
        return V([emailValidator, codeValidator, passwordValidaotr]);
    }
};
