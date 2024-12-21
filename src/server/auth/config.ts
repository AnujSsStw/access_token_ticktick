import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, type NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import {
  OAuth2Config,
  Provider,
  TokenEndpointHandler,
} from "next-auth/providers";
import { db } from "../db";

const clientId = "qSba4cM39GW0tCAKSj";
const clientSecret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe";
const TickTickProvider: OAuth2Config<any> & Provider = {
  id: "ticktick",
  name: "TickTick",
  type: "oauth",
  authorization: {
    url: "https://ticktick.com/oauth/authorize",
    params: {
      scope: "tasks:write tasks:read",
      response_type: "code",
    },
  },
  token: {
    url: "https://ticktick.com/oauth/token",
    async request(context) {
      const res = await fetch("https://ticktick.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: context.params.code,
          grant_type: "authorization_code",
          scope: "tasks:read", // Add the required scopes
          redirect_uri: "http://localhost:3000/api/auth/callback/ticktick",
        }),
      });
      const data = await res.json();
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        scope: data.scope,
        token_type: data.token_type,
        expires_in: data.expires_in,
      };
    },
  } as TokenEndpointHandler,
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  issuer: "https://ticktick.com",
  userinfo: {
    async request({ tokens, provider }) {
      const res = await fetch("https://ticktick.com/open/v1/user/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await res.json();
      console.log(userData);
      // can generate a uuid of id and for email just it null or @
      return {
        id: userData.id || guid(),
        name: userData.name,
        email: userData.email || null,
        image: userData.avatarUrl,
      };
    },
  },
  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.avatarUrl,
    };
  },
  clientId: "qSba4cM39GW0tCAKSj", // from the provider's dashboard
  clientSecret: "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe", // from the provider's dashboard
};

export const authConfig = {
  providers: [TickTickProvider],
  // debug: true,
  // adapter: PrismaAdapter(db),
  callbacks: {
    async session({ session, token, user }) {
      // session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt", token);

      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
export const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
