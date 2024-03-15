/**
 * Модуль контролерів, що відповідають за керування контактами.
 * @module controllers/contactsController
 */

import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} from "../schemas/contactsSchemas.js";
import mongoose from "mongoose";

/**
 * Отримати всі контакти.
 * @function getAllContacts
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить всі контакти.
 * @throws {HttpError} - Помилка з HTTP-кодом 404, якщо контакти не знайдено.
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.getAllContacts();
    if (!result) {
      throw new HttpError(404, "Contacts not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Отримати один контакт за його ідентифікатором.
 * @function getOneContact
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить знайдений контакт.
 * @throws {HttpError} - Помилка з HTTP-кодом 404, якщо контакт не знайдено.
 */
export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }

    const result = await contactsService.getOneContact(id);

    if (!result) {
      throw new HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Видалити контакт за його ідентифікатором.
 * @function deleteContact
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить видалений контакт.
 * @throws {HttpError} - Помилка з HTTP-кодом 404, якщо контакт не знайдено.
 */
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }
    const result = await contactsService.deleteContact(req.params.id);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Створити новий контакт.
 * @function createContact
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить створений контакт.
 * @throws {HttpError} - Помилка з HTTP-кодом 400, якщо дані контакта неправильні.
 */
export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const result = await contactsService.createContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Оновити інформацію про контакт.
 * @function updateContact
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить оновлений контакт.
 * @throws {HttpError} - Помилка з HTTP-кодом 404, якщо контакт не знайдено, або 400, якщо дані контакта неправильні.
 */
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }

    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "Body must have at least one field");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }

    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw new HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Оновити * статус контакту (вибрано чи ні).
 * @function updateStatusContact
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція, яка викликає наступний обробник запиту у цепочці.
 * @returns {JSON} - JSON-об'єкт, що містить оновлений статус контакту.
 * @throws {HttpError} - Помилка з HTTP-кодом 404, якщо контакт не знайдено, або 400, якщо статус неправильний.
 */
export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const { error } = favoriteContactSchema.validate({ favorite });
    if (error) {
      throw new HttpError(400, error.message);
    }
    if (favorite === undefined || typeof favorite !== "boolean") {
      throw new HttpError(400, "Invalid favorite value");
    }
    const result = await contactsService.updateStatusContact(id, favorite);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
