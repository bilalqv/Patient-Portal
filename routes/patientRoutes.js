const express = require('express');
const patientController = require('../controllers/patientController');
const validateInput = require('../middleware/validateInput');

const router = express.Router();

router.get('/dashboard', patientController.home_dashboard);
router.get('/create', patientController.create_patient_get)
router.post('/create', validateInput.validateCreatePatientFormData, patientController.create_patient_post);
router.get('/all', patientController.get_all_patients);
router.post('/update', validateInput.validateUpdatePatientForm, patientController.update_patient_page_post);
router.get('/update', patientController.update_patient_page_get);
router.get('/single', patientController.get_single_patient_form);
router.post('/details', validateInput.validatePatientID,  patientController.get_single_patient_details);
router.get('/minimumwalletform', patientController.patients_with_min_wallet_form_page);
router.post('/minimumwalletdetails', validateInput.validateWalletAmount, patientController.patients_with_min_wallet_details);
router.post('/login', patientController.login);
router.post('/logout', patientController.log_out);

module.exports = router;