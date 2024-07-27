const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_ID_SECRET,
  },
});

exports.handler = async (event) => {
  try {
    let data = JSON.parse(event.body);

    console.log('Sending email to:', data.to);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log('Email sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Welcome to BananaBroom... We make your space shine" }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
