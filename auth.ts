import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/dashboard"
    },
  },
  pages: {
    signIn: "/signin",
  },
})