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

async function checkIfUserExistsInStrapi(account) {
  // Use the account access token obtained from the OAuth provider (Google or GitHub)
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${account.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user from Strapi');
  }

  const userData = await response.json();
  return userData; // This will be the user data from Strapi (new or existing)
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
    async session({ session, token }) {
      session.accessToken = token.jwt as string;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      // On initial sign-in, send welcome email
      if (account && user) {
        //const strapiUserData = await checkIfUserExistsInStrapi(account);
        //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', strapiUserData)
        if (account) {
          // This will only run on the first sign-in
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`
            );
  
            if (!response.ok) {
              throw new Error("Failed to authenticate with Strapi");
            }
  
            const data = await response.json();
  
            // Store Strapi JWT and user information in the token
            token.jwt = data.jwt;
            token.id = data.user.id;
            const welcomeEmailSent = data.user.welcomeEmailSent
            if (!welcomeEmailSent ) {
              await sendWelcomeEmail(user.email);
              try{
                await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${data.user.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token.jwt}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  welcomeEmailSent: true, // Update the user field to mark email sent
                }),
              });
              }catch (error) {
                console.error("Welcome email boolean error:", error);
              }
              
    
              token.emailSent = true; // Update token to avoid multiple calls in this session

            }
          
            console.log("USER", data)
          } catch (error) {
            console.error("Strapi API error:", error);
          }
        }
        console.log(" AAAAAAAAAAAAAAAAAAAAAAAAA This is the token", token)
        // Only send the email on the first sign-in
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        //token.id = user.id;
        
      }
      return token;
    },
    async signIn({ user }) {
      // You can return true to allow the sign-in process to continue
      return true;
    },
  },
});

export { handler as GET, handler as POST };
