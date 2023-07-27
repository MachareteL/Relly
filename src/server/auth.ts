import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user, token }) => {
      console.log("\n\n\n\n\n\nSESSION:", session);
      console.log("\n\n\n\n\n\nUser:", user);
      console.log("\n\n\n\n\n\nTOKEN:", token);

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60, //60 * 10,
    updateAge: 60 * 5, //60 * 5,
  },
  pages: {
    signIn: "/signup",
  },
  events: {
    async session({ session }) {
      const lastUserSession = await prisma.session.findFirst({
        where: { userId: session.user.id },
        orderBy: { expires: "desc" },
      });
      if (lastUserSession) {
        console.log("LASTE USER SESSION: ", lastUserSession.expires);
        console.log("SESSION EXPIRES:    ", session.expires);

        // console.log("\n\n", lastUserSession.expires.valueOf() - new Date(session.expires).valueOf(),"\n\n")
        // console.log(lastUserSession?.expires > new Date(session.expires)? "\nMAIOR\n" : "\nMENOR\n");

        if (lastUserSession?.expires > new Date(session.expires)) {
          await prisma.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              relliesAmmount: { increment: Math.floor(Math.random() * 10) },
            },
          });
        }
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: "SHHHHH",
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
