const {
  model,
} = require('mongoose');

const createError = require('http-errors');
const isEmpty = require('lodash.isempty');
const {
  person: personSchema,
} = require('../schemas/person');

const Person = model('Person', personSchema);

const parsePersonDocument = (person) => ({ ...person.toJSON(), fullName: person.getFullName() });

const getAll = async (req, res, next) => {
  const { query } = req;

  try {
    let peopleList;

    /** Filters by boolean, but since this is a query param, it comes as string */
    if (query.isAlive === 'true' || query.isAlive === 'false') {
      peopleList = await Person.find().byIsAlive(query.isAlive === 'true').sort('dateOfBirth');
    } else if (query.dateOfBirthGt) {
      /** Filter by a date >= dateOfBirthGt */
      peopleList = await Person.find().byDateOfBirthLt(query.dateOfBirthLt).sort('dateOfBirth');
    } else {
      /** Return all available data */
      peopleList = await Person.find().sort('dateOfBirth');
    }

    /** Extends response to include fullName string method */
    peopleList = peopleList.map((person) => (parsePersonDocument(person)));

    res.send(peopleList);
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong listing all persons'));
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await Person.deleteMany();

    res.status(204).send();
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong removing all persons'));
  }
};

const getOneByDni = async (req, res, next) => {
  const { params } = req;

  if (Number.isNaN(parseInt(params.dni, 10))) {
    next(createError.BadRequest('DNI must be a number'));
    return;
  }

  try {
    const personByDni = await Person.findOne().byDni(params.dni);

    if (isEmpty(personByDni)) {
      next(createError.NotFound('No person found for the provided DNI'));
    } else {
      res.send(parsePersonDocument(personByDni));
    }
    return;
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong with the request'));
  }
};

const getLastAddressByDni = async (req, res, next) => {
  const { params } = req;

  if (Number.isNaN(parseInt(params.dni, 10))) {
    next(createError.BadRequest('DNI must be a number'));
    return;
  }

  try {
    const personByDni = await Person.findOne().byDni(params.dni);

    if (isEmpty(personByDni)) {
      next(createError.NotFound(`No person found for DNI ${params.dni}`));
    } else {
      const lastKnownAddress = personByDni.getLastKnownAddress();

      if (isEmpty(lastKnownAddress)) {
        next(createError.NotFound(`No last known address found for DNI ${params.dni}`));
      }

      res.send(lastKnownAddress);
    }
    return;
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong with the request'));
  }
};

const createOne = async (req, res, next) => {
  try {
    const newPerson = new Person({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dni: req.body.dni,
      dateOfBirth: new Date(req.body.dateOfBirth),
      addresses: req.body.addresses,
      isAlive: req.body.isAlive,
    });

    await newPerson.save();

    res.send(parsePersonDocument(newPerson));
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      next(createError.Conflict(`A person already exists with DNI ${req.body.dni}`));
    } else {
      /** A few things can go wrong here, exposing every possible message or a default one */
      next(createError.InternalServerError(
        (e.errors.dni && e.errors.dni.message)
        || (e.errors.firstName && e.errors.firstName.message)
        || (e.errors.lastName && e.errors.lastName.message)
        || 'Something went wrong creating a person',
      ));
    }
  }
};

const updateOneByDni = async (req, res, next) => {
  const { params, body } = req;

  if (Number.isNaN(parseInt(params.dni, 10))) {
    next(createError.BadRequest('DNI must be a number'));
    return;
  }

  try {
    const personToUpdate = await Person.findOne().byDni(params.dni);

    if (isEmpty(personToUpdate)) {
      next(createError.NotFound('No person found for the provided DNI'));
      return;
    }

    personToUpdate.firstName = body.firstName;
    personToUpdate.lastName = body.lastName;
    personToUpdate.addresses = body.addresses;
    personToUpdate.isAlive = body.isAlive;
    personToUpdate.dateOfBirth = body.dateOfBirth;

    await personToUpdate.save();

    res.send(parsePersonDocument(personToUpdate));
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong updating a person by DNI'));
  }
};

const deleteOneByDni = async (req, res, next) => {
  const { params } = req;

  if (Number.isNaN(parseInt(params.dni, 10))) {
    next(createError.BadRequest('DNI must be a number'));
    return;
  }

  try {
    const deleteData = await Person.deleteOne().byDni(params.dni);

    if (deleteData.deletedCount === 0) {
      next(createError.NotFound('No person found for the provided DNI'));
    } else {
      res.send(204);
    }
    return;
  } catch (e) {
    console.log(e);
    next(createError.InternalServerError('Something went wrong deleting a person by DNI'));
  }
};

module.exports = {
  createOne,
  getAll,
  getOneByDni,
  getLastAddressByDni,
  deleteOneByDni,
  deleteAll,
  updateOneByDni,
};
