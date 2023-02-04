const request = require('supertest');
const app = require('../app');
const PatientTable = require('../models/Patient');


const patientG = {
  name: 'Global Patient',
  age: 21,
  gender: 'Male',
  walletAmount: 5666,
}

beforeAll(async () => {
  await PatientTable.destroy({
    where: {}
  })
});

describe('Checking Patient Routes.', () => {

  describe('Create Patient.', () => {
    test('Given all the input fields are valid, it should create a new patient', async () => {
      const patient = {
        name: 'Name',
        age: 23,
        gender: 'Male',
        walletAmount: 900,
      }
      const res = await request(app).post('/patient/create').send(patient);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(patient);
    });


    test('Given only few input fields, this test should fail', async () => {
      const patient = {
        name: 'Name 2',
        age: 23,
        gender: 'Female',
        // walletAmount : 900,
      }
      const res = await request(app).post('/patient/create').send(patient);
      expect(res.status).not.toBe(200);
    });

    test('Given invalid input fields, this test should fail', async () => {
      const patient = {
        name: 'Name 3',
        age: -23,
        gender: 'Male',
        walletAmount: 300,
      }
      const res = await request(app).post('/patient/create').send(patient);
      expect(res.status).not.toBe(200);
    });
  });


  describe('Update Patient.', () => {

    test('Given valid Patient ID and Wallet Amount, it should pass', async () => {
      const inputPatient = await PatientTable.create(patientG);

      const outputPatient = await request(app).post('/patient/update').send({
        id: String(inputPatient.dataValues.id),
        walletAmount: 3334,
      });
      expect(outputPatient.statusCode).toBe(200);
      const updatedPatient = await request(app).post('/patient/details').send({
        id: String(inputPatient.dataValues.id),
      });
      expect(updatedPatient.status).toBe(200);
      expect(updatedPatient.body.walletAmount).toBe(3334);
    });

    test('Given invalid patient, this test should fail', async () => {
      const inputPatient = await PatientTable.create(patientG);

      const outputPatient = await request(app).post('/patient/update').send({
        id: -3,
        walletAmount: 3334,
      });
      expect(outputPatient.status).not.toBe(200);
      const res = await request(app).post('/patient/update').send({
        id: String(inputPatient.dataValues.id),
        walletAmount: -300,
      });
      expect(res.status).not.toBe(200);
    });

  });

  describe('Get Single Patient Details', () => {

    test('Given Valid patient ID, it should give correct details.', async () => {
      const inputPatient = await PatientTable.create(patientG);
      const outputPatient = await request(app).post(`/patient/details`).send({
        id: String(inputPatient.dataValues.id),
      });
      expect(outputPatient.status).toBe(200);
      expect(outputPatient.body).toMatchObject(patientG);
    });

    test('Given Invalid patient ID, it should not return any patient data.', async () => {
      let outputPatient = await request(app).get(`/patient/details`).send({
        id: -4,
      });
      expect(outputPatient.status).not.toBe(200);
      outputPatient = await request(app).get(`/patient/details`).send({
        id: 'abc',
      });
      expect(outputPatient.status).not.toBe(200);
    });

  });

  describe('Get All Patients.', () => {

    test('Given all patients with valid details.', async () => {
      const inputPatient1 = await PatientTable.create(patientG);
      const inputPatient2 = await PatientTable.create(patientG);
      const patientList = await request(app).get('/patient/all');
      expect(patientList.status).toBe(200);
      for (let patient of patientList.body) {
        expect(patient).toMatchObject(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            age: expect.any(Number),
            gender: expect.any(String),
            walletAmount: expect.any(Number),
          })
        )
      }
    });
  });

  describe('Get Patients with Minimum Wallet Amount.', () => {

    test('Given valid minimum wallet amount, it should give correct patient list', async () => {
      const inputPatient = await PatientTable.create(patientG);
      const patientList = await request(app).post('/patient/minimumwalletdetails').send({
        minWalletAmount: 7,
      });
      expect(patientList.status).toBe(200);
    });
  });

});

