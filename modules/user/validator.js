import { body } from 'express-validator';
import { V, mobileValidator, codeValidator, nameValidator, lastNameValidator, passwordValidaotr } from '../../common/index.js';


export default {
    signup: () => {
        return VHOC([mobileValidator]);
    },
    resendVerification: () => {
        return V([mobileValidator]);
    },
    verify: () => {
        return V([mobileValidator, codeValidator]);
    },
    setProfile: () => {
        return V([
            mobileValidator,
            codeValidator,
            nameValidator,
            lastNameValidator,
            passwordValidaotr
        ]);
    },
    login: () => {
        return V([mobileValidator, passwordValidaotr]);
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
        return V([mobileValidator]);
    },
    setNewPassword: () => {
        return V([mobileValidator, codeValidator, passwordValidaotr]);
    }
};
