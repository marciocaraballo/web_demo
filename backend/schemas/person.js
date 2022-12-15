const {
  Schema,
} = require('mongoose');
const isEmpty = require('lodash.isempty');

const personSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Missing first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'Missing last name!'],
  },
  dni: {
    type: Number,
    required: true,
    unique: true,
    min: [0, 'DNI can\'t be negative!'],
  },
  dateOfBirth: Date,
  addresses: [{
    name: String,
    number: Number,
  }],
  isAlive: Boolean,
});

// Query everyone by isAlive flag
personSchema.query.byIsAlive = function byIsAlive(isAlive) {
  return this.where({ isAlive });
};

// Build a string for the person full name
personSchema.methods.getFullName = function getFullName() {
  return `${this.firstName} ${this.lastName}`;
};

// Get last known adress of a person, or inform that it doesn't exist
personSchema.methods.getLastKnownAddress = function getLastKnownAddress() {
  const { addresses } = this;

  if (isEmpty(addresses)) {
    return undefined;
  }

  return addresses[0];
};

// Query to retrieve a person by dni
personSchema.query.byDni = function byDni(dni) {
  return this.where({ dni });
};

// Query to retrieve everyone whose dateOfbirth is lt param
personSchema.query.byDateOfBirthLt = function byDateOfBirthLt(dateOfBirth) {
  return this.where({ dateOfBirth: { $lt: new Date(dateOfBirth) } });
};

module.exports = { person: personSchema };
