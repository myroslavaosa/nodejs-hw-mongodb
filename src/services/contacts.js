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


