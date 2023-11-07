// const dotEnvResult = require('dotenv').config()

const prod = process.env.NODE_ENV === 'production'

// if (dotEnvResult.error) {
//   throw dotEnvResult.error
// }

module.exports = {
  env: {
    DEBUG: !prod,
    API_URL: prod ? process.env.API_URL : 'http://localhost',
  },
}
