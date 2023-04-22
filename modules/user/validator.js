import { body } from 'express-validator';

export default {
    signup: () => {
        return [mobileValidator];
    },
    resendVerification: () => {
        return [mobileValidator];
    },
    verify: () => {
        return [mobileValidator, codeValidator];
    },
    setProfile: () => {
        return [
            mobileValidator,
            codeValidator,
            nameValidator,
            lastNameValidator,
            passwordValidaotr
        ];
    },
    login: () => {
        return [mobileValidator, passwordValidaotr];
    },
    changePassword: () => {
        return [
            passwordValidaotr,
            body('new').exists({ checkFalsy: true, checkNull: true }).withMessage('please enter valid password')
                .isLength({ min: 6 }).withMessage('password must be atleast 6 character')
        ];
    },
    updateProfile: () => {
        return [nameValidator, lastNameValidator];
    },
    forgetPassword: () => {
        return [mobileValidator];
    },
    setNewPassword: () => {
        return [mobileValidator, codeValidator, passwordValidaotr];
    }
};
