// src/db/contactSchema.js
import { Schema, model, Types } from 'mongoose';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            required: true,
            default: 'personal'
        },
        userId: { type: Types.ObjectId, ref: 'users', required: true }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ContactCollection = model('contact', contactSchema);
