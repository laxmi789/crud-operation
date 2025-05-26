import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "../../../lib/mongodb"
import { compare } from "bcryptjs"

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise
        const db = client.db()
       
        const user = await db.collection("registers").findOne({ email: credentials.email })

        if (!user) throw new Error("No user found with that email")

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) throw new Error("Incorrect password")

        return { id: user._id, email: user.email, name: user.name, userRole: user.user_role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions)
