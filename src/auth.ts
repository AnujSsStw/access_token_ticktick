import { Lucia } from "lucia";
import { db } from "./server/db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
const adapter = new PrismaAdapter(db.session, db.user);
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://ticktick.com/oauth/authorize";
const tokenEndpoint = "https://ticktick.com/oauth/token";
const clientId = "qSba4cM39GW0tCAKSj";
const clientSecret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe";

export const oauth2Client = new OAuth2Client(
  clientId,
  authorizeEndpoint,
  tokenEndpoint,
  {
    redirectURI: "http://localhost:3000/api/login/github/callback",
  },
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      github_id: number;
      username: string;
    };
  }
}
