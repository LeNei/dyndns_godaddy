const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  domain: process.env.MYDOMAIN,
  hostname: process.env.MYHOSTNAME,
  apikey: process.env.APIKEY
}