const sendResponse = require('../Util/responseUtil');

const validateUpdatePatientForm = (req, res, next) => {
  const dataToSend = {
    isDataSendingRequired: false,
    value: null,
    title: 'Home Page',
    path: 'patients/index',
    authorized: req.session.authorized,
    messageContent : null,
  };
  const patientID = req.body.id, walletAmount = req.body.walletAmount;
  if(!isValidPatientID(patientID)) {
    dataToSend.messageContent = 'You entered invalid patient ID.';
    sendResponse(res, dataToSend, 400);
  } else if(!isValidWalletAmount(walletAmount)) {
    dataToSend.messageContent = 'You entered invalid wallet amount.';
    sendResponse(res, dataToSend, 400);
  } else {
    next();
  }
}

const validatePatientID = (req, res, next) => {
  
  const patientID = req.body.id;
  if(!isValidPatientID(patientID)) {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Home Page',
      path: 'patients/index',
      authorized: req.session.authorized,
      messageContent : 'You entered invalid patient ID.',
    }
    sendResponse(res, dataToSend, 400);
  } else {
    next();
  }
}

const validateWalletAmount = (req, res, next) => {
  const walletAmount = req.body.minWalletAmount;
  if(!isValidWalletAmount(walletAmount)) {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Home Page',
      path: 'patients/index',
      authorized: req.session.authorized,
      messageContent : 'Please enter a valid Wallet Amount.',
    }
    sendResponse(res, dataToSend, 400);
  } else {
    next();
  }
}

const validateCreatePatientFormData = (req, res, next) => {
  const name = req.body.name;
  const age = req.body.age;
  const gender = req.body.gender;
  const walletAmount = req.body.walletAmount;
  const dataToSend = {
    isDataSendingRequired: false,
    value: null,
    title: 'Home Page',
    path: 'patients/index',
    authorized: req.session.authorized,
    messageContent : null,
  }
  if(!isValidName(name)) {
    console.log('name');
    dataToSend.messageContent = 'Please Enter a valid name.';
    sendResponse(res, dataToSend, 400);
  } else if(!isValidAge(age)) {
    console.log('age');
    dataToSend.messageContent = 'Please Enter a valid age.';
    sendResponse(res, dataToSend, 400);
  } else if(!isValidGender(gender)) {
    console.log('gender');
    dataToSend.messageContent = 'Please Enter a valid Gender.';
    sendResponse(res, dataToSend, 400);
  } else if(!isValidWalletAmount(walletAmount)) {
    console.log('wallet');
    dataToSend.messageContent = 'Please Enter a valid Wallet Amount.';
    sendResponse(res, dataToSend, 400);
  } else {
    next();
  }
}

function isValidName (name) {
  if(name == null || name == "" || !name) return false;
  return true;
}

function isValidAge (age) {
  if(!isNumeric(age) || Number(age) < 0 || Number(age) > 200) return false;
  return true;
}

function isValidGender (gender)  {
  const validGender = ['Male', 'M', 'male', 'Female', 'Female', 'female'];
  return (validGender.includes(gender));
}

function isValidWalletAmount (walletAmount) {
  if(!isNumeric(walletAmount) || Number(walletAmount) < 0) return false;
  return true;
}

function isValidPatientID (id) {
  return (isNumeric(id) && Number(id) > 0);
}

function isNumeric(str) {
  if(typeof str == "number") return true;
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = {
  validatePatientID,
  validateWalletAmount,
  validateCreatePatientFormData,
  validateUpdatePatientForm,
}