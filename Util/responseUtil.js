
const sendResponse = (res, data, responseStatus = 200) => {
  const currentEnv = process.env.NODE_ENV;
  if(currentEnv == 'development') {
      res.status(responseStatus).render(data.path, { patientData : data.value, title : data.title, authorized : data.authorized, messageContent: data.messageContent });
  } else if(currentEnv == 'test') {
    if(data.isDataSendingRequired) {
      res.status(responseStatus).send(data.value);
    } else {
      res.status(responseStatus).render(data.path, { patientData : data.value, title : data.title, authorized : data.authorized, messageContent : data.messageContent });
    }
  }
};

module.exports = sendResponse;