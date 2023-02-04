const app = require('./loader');
const patientRoutes = require('./routes/patientRoutes');
const session = require('express-session');
const { authorizeSession } = require('./middleware/sessionAuth');
const sequelize = require('./Util/database');


app.get('/', (req, res) => {
  res.redirect('/patient/dashboard')
})

app.get('/createdb', async (req, res) => {
  try {
    await sequelize.sync();
    res.status(200).send('Successfull.')
  } catch (e) {
    console.log('Error', e);
    res.status(400).send('Error!')
  }
})

// patient routes
if(process.env.NODE_ENV == 'development') {
  app.use( authorizeSession );
}

app.use('/patient', patientRoutes);

const PORT = process.env.PORT || 5600;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`)
})

module.exports = app;