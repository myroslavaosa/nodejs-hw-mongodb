import { gettingContactId, gettingContacts, patchContact, postContact, deleteContact } from "../services/contacts.js";
import createError from 'http-errors';

export const getAllContacts = async (req, res, next) => {
    const result = await gettingContacts();
    res.status(result.status).json(result);
};

export const getContactById = async (req, res, next) => {
    const result = await gettingContactId(req.params.contactId);
    if (!result.data) {
        return next(createError(404, 'Contact not found'));
    }

    res.json({
        status: 200,
        message: `Successfully got a contact!`,
        data: result.data,
    });
};

export const createContactController = async (req, res, next) => {
    const contact = await postContact(req.body);
    if (!contact) {
        return next(createError(404, 'Contact not found'));
    }

    res.json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const updateContactController = async (req, res, next) => {
    const contact = await patchContact(req.params.contactId, req.body);
    if (!contact) {
        return next(createError(404, 'Contact not found for update'));
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: contact,
    });
};


export const deleteContactController = async (req, res, next) => {
    const contact = await deleteContact(req.params.contactId, req.body);
    if (!contact) {
        next(createError(404, 'Contact not found for deletion'));
        return;
    }

    res.status(204).send();
};
