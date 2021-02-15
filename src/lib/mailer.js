const nodemailer = require('nodemailer');

// Integração do Nodemailer com Mailtrap.io
module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "55adb5e05093dc",
        pass: "523da4e496b05e"
    }
});