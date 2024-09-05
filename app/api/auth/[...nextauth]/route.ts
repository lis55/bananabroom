import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from 'next-auth/providers/github';
import nodemailer from 'nodemailer';
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



const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
     providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: async ({ session, user, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string
      if (session.user){
        session.user.id = token.id as string
      }
      
      
      //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ", session.user)
      return session
    },
    
  
    jwt: async( { token, account, profile }) =>{
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account){

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/google/callback?access_token=${account.access_token}`
        );
        const data = await response.json();
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ", account)
        token.accessToken = data.jwt;
        token.id = data.user.id;
        token.refreshToken = account.refresh_token; // Capture and store the refresh token
        token.accessToken = account.accessToken;
        //token.refreshToken = newToken.refreshToken;
        console.log("AAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBAAAAAAAAA ", token)
      } catch (error) {
        console.log('There was an error', error);
      }
      
      }
      
      
      return token
    },
    signIn: async ({ user, account, profile, email, credentials }) => {

      const accessToken = await getAccessToken()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
          //refreshToken: tokens.refresh_token,
          accessToken: accessToken,

        },
        tls: {
          rejectUnauthorized: false
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Welcome to BananaBroom',
        text: 'We make your space shine',
        html: '<p>We make your space shine</p>',
      }).catch(error => {
        console.error("Error sending email: ", error.message);
        console.error("Stack trace: ", error.stack);
      });
      
      

      return true; // Return true to indicate successful sign in
    },
  },  
})

export { handler as GET, handler as POST }
