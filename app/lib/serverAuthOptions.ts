import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid","email","profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/calendar.readonly"
          ].join(" ")
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }: any) {
      if (account?.access_token) token.accessToken = account.access_token;
      if (account?.expires_at) token.expiresAt = account.expires_at;
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
      return session;
    }
  }
};

export default authOptions;
