const redis = require('redis');
// const { REDIS_PORT, REDIS_URL } = require('../config/config');

const client = redis.createClient();

// connect redis
client.connect().then(() => {
  console.log('Redis connected initially.');
}).catch(err => {
  console.log('Error in connecting redis : ', err);
  throw err;
})

// set data to redis
const setRedisData = async (id, patient) => {
  try {
    const data = await JSON.stringify(patient);
    const redisTimeout = 3 * 24 * 60 * 60;
    await client.setEx(id, redisTimeout, data);
    return true;
  } catch (err) {
    console.log('Error: inside redis set func...', err);
    throw err;
  }
}

// get data from redis
const getRedisData = async (id) => {
  try {
    const patientRawData = await client.get(id);
    const patientData = await JSON.parse(patientRawData);
    return patientData;
  } catch (err) {
    console.log('Error: inside redis get func...', err);
    return false;
  }
}

module.exports = {
  setRedisData,
  getRedisData,
}