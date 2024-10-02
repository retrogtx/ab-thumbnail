import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"

export const {
  handlers,
  auth,
  signIn,
  signOut 
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("Session callback - User:", user)
      if (session.user) {
        session.user.id = user.id;
      }
      console.log("Session callback - Updated session:", session)
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  events: {
    async signOut() {
      console.log("SignOut event triggered")
    },
  },
})