import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import fetch from 'node-fetch';

async function getAccessToken() {
  const url = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // Stored refresh token
    grant_type: 'refresh_token',
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const tokens = await response.json();
  if (!response.ok) {
    console.error('Error refreshing tokens', tokens);
    throw tokens;
  }

  return tokens.access_token;
}

async function sendWelcomeEmail(userEmail) {
  const accessToken = await getAccessToken();
  const nodemailer = await import('nodemailer'); // Dynamically import Nodemailer

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Welcome to BananaBroom',
    text: 'We make your space shine',
    html: '<p>We make your space shine</p>',
  }).catch(error => {
    console.error("Error sending email: ", error.message);
    console.error("Stack trace: ", error.stack);
  });
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = account.id;
      }
      return token;
    },
    signIn: async ({ user }) => {
      // Trigger asynchronous email sending
      sendWelcomeEmail(user.email)
        .then(() => console.log("Welcome email sent"))
        .catch((error) => console.error("Error sending email", error));

      return true; // Continue sign-in flow without waiting for email to send
    },
  },
});

export { handler as GET, handler as POST };
