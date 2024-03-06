import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
     providers: [
    GoogleProvider({
      clientId: "171780189307-1vhvhmcplu16shbuersuc0t6gje0j7b9.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    GitHubProvider({
      clientId: "19020dfe1581f150b0f1",
      clientSecret: "61469bee2cd6a17e865faf96886fe4c87bc1d31a",
    }),
  ],
})

export { handler as GET, handler as POST }
