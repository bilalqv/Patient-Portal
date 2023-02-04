const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Util/database');

const PatientTable = sequelize.define('PatientTable', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: 0
    }
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isGenderTrue(value) {
        value = value.trim();
        const values = ['Male', 'male', 'M', 'm', 'Female', 'female', 'f'];
        if (!values.includes(value)) {
          throw new Error('Invalid Gender');
        }
      },
    }
  },
  walletAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: 0,
    }
  }
}, {
  timestamps: false
});

module.exports = PatientTable;