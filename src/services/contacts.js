// src/services/contacts.js
import { ContactCollection } from '../db/Contact.js';

export const gettingContacts = async () => {
    const contacts = await ContactCollection.find();
    return {
        status: 200,
        message: "Successfully found contacts!",
        data: contacts
    };
};

export const gettingContactId = async (id) => {
    const contact = await ContactCollection.findById(id);
    if (!contact) {
        return {
            status: 404,
            message: "Contact not found",
            data: null
        };
    }
    return {
        status: 200,
        message: "Successfully found contact!",
        data: contact
    };
};

export const postContact = async (payload) => {
    const contact = await ContactCollection.create(payload);
    return contact;
};

export const patchContact = async (id, updateData) => {
    const contact = await ContactCollection.findByIdAndUpdate(id, updateData, { new: true });
    return contact;
};

export const deleteContact = async (id, updateData) => {
    const contact = await ContactCollection.findByIdAndDelete(id, updateData, { new: true });
    return contact;
};
