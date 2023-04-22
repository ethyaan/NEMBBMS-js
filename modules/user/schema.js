import { Schema, model } from 'mongoose';
/**
 * define user schema
 */
const userSchema = new Schema({
    email: {
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

export const UserModel = model('User', userSchema, 'user');
