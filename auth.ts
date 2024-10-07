import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Google from "next-auth/providers/google"
import { Adapter } from "next-auth/adapters"

interface UserData {
  name?: string | null
  email?: string | null
  image?: string | null
}

const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (user: UserData) => {
    if (!user.email) {
      throw new Error("User email is required")
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })
    if (existingUser) {
      return existingUser
    }
    return prisma.user.create({ data: user })
  },
} as Adapter

export const {
  handlers,
  auth,
  signIn,
  signOut 
} = NextAuth({
  adapter: customAdapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.AUTH_SECRET,
})