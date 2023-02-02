const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
      user: 'shafi.bahrami.2015@gmail.com',
      pass: 'fistfkpsdamcnoij',
   },
   tls: {
      rejectUnauthorized: false
   }
});

module.exports = transporter;