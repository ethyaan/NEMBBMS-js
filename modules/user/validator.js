// const { body, validationResult, checkSchema } =require('express-validator');
// const mobilePattern = /^\+\d{1,3}-\d{9,10}$/;

// const mobileValidator = body('mobile').matches(mobilePattern, 'g').withMessage('please enter valid mobile number');
// const codeValidator = body('code').exists({ checkFalsy: true, checkNull: true}).withMessage('code is not valid');
// const passwordValidaotr = body('password').exists({ checkFalsy: true, checkNull: true})
// .withMessage('please enter valid password')
// .isLength({ min: 6 }).withMessage('password must be atleast 6 character');
// const nameValidator = body('name').exists({ checkFalsy: true, checkNull: true}).withMessage('name is not valid')
// .isLength({ min: 3 }).withMessage('name must be atleast 3 character');
// const lastNameValidator = body('lastName').exists({ checkFalsy: true, checkNull: true}).withMessage('lastName is not valid')
// .isLength({ min: 3 }).withMessage('lastName must be atleast 3 character');

// module.exports =  {
// 	validate: (req, res, next) => {
// 		const errors = validationResult(req);
// 		if (errors.isEmpty()) {
// 			return next();
// 		}
// 		const extractedErrors = [];
// 		errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
// 		return res.status(422).json({
// 			errors: extractedErrors,
// 		});
// 	},
// 	signup: () => {
// 		return [ mobileValidator ];
// 	},
// 	resendVerification: () => {
// 		return [ mobileValidator ];
// 	},
// 	verify: () => {
// 		return [ mobileValidator, codeValidator ];
// 	},
// 	setProfile: () => {
// 		return [
// 			mobileValidator,
// 			codeValidator,
// 			nameValidator,
// 			lastNameValidator,
// 			passwordValidaotr
// 		];
// 	},
// 	login: () => {
// 		return [ mobileValidator, passwordValidaotr ];
// 	},
// 	changePassword: () => {
// 		return [
// 			passwordValidaotr,
// 			body('new').exists({ checkFalsy: true, checkNull: true}).withMessage('please enter valid password')
// 			.isLength({ min: 6 }).withMessage('password must be atleast 6 character')
// 		];
// 	},
// 	updateProfile: () => {
// 		return [ nameValidator, lastNameValidator ];
// 	},
// 	forgetPassword: () => {
// 		return [ mobileValidator ];
// 	},
// 	setNewPassword: () => {
// 		return [ mobileValidator, codeValidator, passwordValidaotr ];
// 	}
// };
