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
        let user = await User.findOne({
          email: profile.email.toLowerCase(),
        });
        // If user does not exist, create a new one
        if (!user) {
          try {
            user = new User({
              email: profile.email.toLowerCase(),
              name: profile.name || profile.email.split("@")[0],
              password: null, // Google-auth users don't have local pwd
              role: "EMPLOYEE", // Default role or adjust as needed
            });
            await user.save();
          } catch (error) {
            console.error("Failed to create user during Google sign-in:", error);
            return false;
          }
        }
        return true;
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
