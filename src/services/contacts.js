// src/services/contacts.js
import { SORT_ORDER } from '../constants/index.js';
import { ContactCollection } from '../db/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const gettingContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    type,
    isFavourite,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const filter = {};
    if (type) {
        filter.contactType = type;
    }

    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite;
    }

    const contactsQuery = ContactCollection.find(filter);
    const contactsCount = await ContactCollection.find()
        .merge(contactsQuery)
        .countDocuments(filter);


    const contacts = await contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);


    return {
        status: 200,
        message: "Successfully found contacts!",
        data: {
            contacts,
            ...paginationData,
        }
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
