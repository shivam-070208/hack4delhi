import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/db/connect";
import User from "@/db/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).lean();
        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password || "",
        );
        if (!isValid) return null;
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Allow only users in the database to sign in, no new users created by Google OAuth
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      async signIn({ profile }) {
        if (!profile?.email) return false;
        await connectDB();
        const user = await User.findOne({
          email: profile.email.toLowerCase(),
        }).lean();
        return !!user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      } else if (token?.email) {
        await connectDB();
        const dbUser = await User.findOne({
          email: token.email.toLowerCase(),
        }).lean();
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); // NextAuth returns a handler; do not destructure, just export default
