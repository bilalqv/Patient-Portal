const PatientTable = require('../models/Patient');
const redisService = require('../services/redisService');

const fetchSinglePatientData = async (req, res) => {
  try {
    const patientID = req.params.id || req.body.id;
    // check if patient data exists in redis cache
    const redisPatientData = await redisService.getRedisData(patientID);
    if (redisPatientData) {
      console.log('Fetched from redis.');
      return redisPatientData;
    } else {
      // patient id not in redis cache, now fetch from DB.
      const patient = await PatientTable.findOne({
        where: { id: patientID },
      })
      // set data to redis
      console.log('Data Fetched from DB.');
      await redisService.setRedisData(patientID, patient);
      return patient;
    }
  } catch (err) {
    console.log('Error in fetching single patient data....');
    res.status(500);
  }
}

module.exports = {
  fetchSinglePatientData,
}