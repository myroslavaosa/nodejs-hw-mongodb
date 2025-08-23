import { Router } from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, patchContactSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';


const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', isValidId, validateBody(patchContactSchema), ctrlWrapper(updateContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
