const PatientTable = require('../models/Patient');
const { Op } = require('sequelize');
const fetchData = require('../services/fetchData');
const sendResponse = require('../Util/responseUtil');
const redisService = require('../services/redisService');

const home_dashboard = (req, res) => {
  const dataToSend = {
    isDataSendingRequired: false,
    value: null,
    title: 'Home Page',
    path: 'patients/index',
    authorized: req.session.authorized,
    messageContent: null,
  };
  try {
    sendResponse(res, dataToSend, 200);
  } catch (err) {
    console.log('Error Occured', err);
    res.status(500).send('Internal Error');
  }
}

const create_patient_get = (req, res) => {
  const dataToSend = {
    isDataSendingRequired: false,
    value: null,
    title: 'Create Patients',
    path: 'patients/createPatient',
    authorized: req.session.authorized,
    messageContent: null,
  }
  sendResponse(res, dataToSend);
}

const create_patient_post = async (req, res) => {

  try {
    const newPatient = await PatientTable.create({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      walletAmount: req.body.walletAmount,
    });
    const dataToSend = {
      isDataSendingRequired: true,
      value: newPatient,
      title: 'Home Page',
      path: 'patients/index',
      authorized: req.session.authorized,
      messageContent: 'Patient Created Successfully',
    };
    sendResponse(res, dataToSend, 200);
  } catch (err) {
    console.log('Error in insertion...');
    res.status(500).send('Error in insertion....');
  }
}

const get_all_patients = async (req, res) => {
  try {
    const patientData = await PatientTable.findAll();
    const dataToSend = {
      isDataSendingRequired: true,
      value: patientData,
      title: 'All Patients',
      path: 'patients/allPatients',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    if (err) {
      console.log(`Error: ${err}`);
      res.status(500).send('Error in getting patients');
    }
  }
}

const update_patient_page_get = (req, res) => {
  try {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Update Patient',
      path: 'patients/updatePatient',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    console.log('Error in getting update page form');
    res.status(500).send(err);
  }
}

const update_patient_page_post = async (req, res) => {
  try {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Home Page',
      path: 'patients/index',
      authorized: req.session.authorized,
      messageContent: null,
    };
    let patient = null;
    const patientID = req.body.id;
    if (!patientID) {
      dataToSend.messageContent = 'Invalid Patient ID';
      sendResponse(res, dataToSend);
    } else {
      patient = await PatientTable.findOne({
        where: { id: patientID },
      })
      if (!patient) {
        dataToSend.messageContent = 'No patient exists with this ID';
        sendResponse(res, dataToSend, 404);
      } else {
        const updatedPatient = await PatientTable.update(
          {
            walletAmount: req.body.walletAmount,
          },
          {
            where: { id: patientID },
          })
        dataToSend.messageContent = 'Patient Updated';
        const redisValue = redisService.getRedisData(patientID);
        if(redisValue) {
          patient.walletAmount = req.body.walletAmount;
          await redisService.setRedisData(patientID, patient)
        }
        sendResponse(res, dataToSend);
      }
    }
  } catch (err) {
    res.status(500).send('Error in upating patient.', err);
  }
}

const get_single_patient_form = async (req, res) => {
  try {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Single Patient Form',
      path: 'patients/singlePatientForm',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    res.status(400).send('Error in getting form page.');
  }
}

// redis used here, inside fetchSinglePatientData() function
const get_single_patient_details = async (req, res) => {
  try {
    const patient = await fetchData.fetchSinglePatientData(req, res);
    const dataToSend = {
      isDataSendingRequired: true,
      value: patient,
      title: 'Single Patient Details',
      path: 'patients/singlePatientDetails',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    res.status(500).send('Error in getting Patient Details.');
  }
}

const patients_with_min_wallet_form_page = (req, res) => {
  try {
    const dataToSend = {
      isDataSendingRequired: false,
      value: null,
      title: 'Get Patients with min wallet',
      path: 'patients/patientsWithMinWalletFormPage',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    if (err) {
      res.status(404).send('Error in getting form page');
    }
  }
}

const patients_with_min_wallet_details = async (req, res) => {
  try {
    const minimumWalletAmount = req.body.minWalletAmount;
    const patients = await PatientTable.findAll({
      where: {
        walletAmount: {
          [Op.gt]: minimumWalletAmount,
        }
      }
    });
    const dataToSend = {
      isDataSendingRequired: true,
      value: patients,
      title: 'Patients with Minimum Wallet Amount',
      path: 'patients/patientsWithMinWalletDetails',
      authorized: req.session.authorized,
      messageContent: null,
    }
    sendResponse(res, dataToSend);
  } catch (err) {
    res.status(500).send('Error in getting patients.');
  }
}

const login = (req, res) => {
  try {
    console.log('Inside login');
    req.session.authorized = true;
    req.session.save();
    res.redirect('/patient/dashboard');
  } catch (err) {
    res.status(500).send('Error in Log In.');
  }
}

const log_out = (req, res) => {
  req.session.authorized = false;
  req.session.save();
  res.redirect('/patient/dashboard');
}

module.exports = {
  home_dashboard,
  create_patient_get,
  create_patient_post,
  get_all_patients,
  update_patient_page_get,
  update_patient_page_post,
  get_single_patient_form,
  get_single_patient_details,
  patients_with_min_wallet_form_page,
  patients_with_min_wallet_details,
  login,
  log_out
}