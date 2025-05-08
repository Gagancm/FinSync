require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'Gagan_database',
  password: process.env.DB_PASSWORD || '1234@4321',
  server: 'Gagan',  // Note the double backslash for the instance name
  database: process.env.DB_DATABASE || 'Project',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000
};

module.exports = config;