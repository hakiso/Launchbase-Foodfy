const nodemailer = require('nodemailer');

// Integração do Nodemailer com Mailtrap.io
module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
    user: "dad28514df7103",
    pass: "c5f2862955b4f5"
  }
});