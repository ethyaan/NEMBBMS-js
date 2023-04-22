import { body, validationResult } from 'express-validator';

/**
 * // @todo: we may need to implement this as global middleware, testing is required to do that.
 * validate request middleware
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({
        errors: extractedErrors,
    });
};


/**
 * A higher Order Function to add validation chech function ath the end of the chain
 * @param validation - array of validators
 * @returns 
 */
export const V = (validation) => {
    return [validation, validate];
}

export const mobilePattern = /^\+\d{1,3}-\d{9,10}$/;
export const mobileValidator = body('mobile').matches(mobilePattern, 'g').withMessage('please enter valid mobile number');

export const emailValidator = body('email').isEmail().withMessage('please enter valid email address');

export const codeValidator = body('code').exists({ checkFalsy: true, checkNull: true }).withMessage('code is not valid');

export const passwordValidaotr = body('password').exists({ checkFalsy: true, checkNull: true })
    .withMessage('please enter valid password')
    .isLength({ min: 6 }).withMessage('password must be atleast 6 character');

export const nameValidator = body('name').exists({ checkFalsy: true, checkNull: true }).withMessage('name is not valid')
    .isLength({ min: 3 }).withMessage('name must be atleast 3 character');

export const lastNameValidator = body('lastName').exists({ checkFalsy: true, checkNull: true }).withMessage('lastName is not valid')
    .isLength({ min: 3 }).withMessage('lastName must be atleast 3 character');