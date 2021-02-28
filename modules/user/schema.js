const { Schema, ...mongoose } = require('mongoose');
/**
 * define user schema
 */
const userSchema = new Schema({
	mobile: {
		type: String,
		index: true,
		unique: true
	},
	name: {
		type: String
	},
	lastName: {
		type: String
	},
	password: {
		type: String
	},
	verificationCode: {
		type: String
	},
	verificationCodeDate: {
		type: Date,
		default: Date.now
	},
	verified: {
		type: Boolean,
		default: false
	},
	refreshToken: { type: String }
}, {
	versionKey: false,
	timestamps: true
});

const UserModel = mongoose.model('User', userSchema, 'user');

UserModel.createIndexes();

module.exports = { UserModel };
