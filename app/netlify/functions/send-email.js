const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  let data = JSON.parse(event.body);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_ID_SECRET,
      },
  });

  await transporter.sendMail({
    from:process.env.EMAIL,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Welcome to BananaBroom... We make your space shine" })
  };
}
