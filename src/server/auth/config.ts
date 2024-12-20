import { type DefaultSession, type NextAuthConfig } from "next-auth";
import {
  OAuth2Config,
  OAuthConfig,
  OAuthUserConfig,
  Provider,
  TokenEndpointHandler,
} from "next-auth/providers";
import { redirect } from "next/dist/server/api-utils";
import { tkCode } from ".";
import { doit } from "test";
import { overrides } from ".eslintrc.cjs";

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
      // redirect_uri: "http://localhost:3000/api/auth/callback/ticktick",
      clientId,
    },
  },
  token: {
    url: "https://ticktick.com/oauth/token",
    async request(response) {
      const credentials = btoa(`${clientId}:${clientSecret}`); // Encodes to base64

      console.log("tkCode", response);

      const redirectUri = "http://localhost:3000/api/auth/callback/ticktick";
      const res = await fetch("https://ticktick.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
          accept: "application/json",
        },
        body: new URLSearchParams({
          code: tkCode!,
          grant_type: "authorization_code",
          scope: "tasks:write tasks:read", // Add the required scopes
          redirect_url: "http://localhost:3000/api/auth/callback/ticktick",
        }),
      });
      console.log("res", res);

      const data = await res.json();
      console.log("Access Token:", data); // Access token from the response
      const tokens = {
        access_token: data.access_token,
        token_type: data.token_type,
        scope: data.scope,
        expires_in: data.expires_in,
      };
      return tokens;
    },
  },
  issuer: "https://ticktick.com",
  profile() {
    return {
      id: "1",
      name: "ani",
      email: "heelo",
      image: "", // Add image if available in profile
    };
  },
  clientId: "qSba4cM39GW0tCAKSj", // from the provider's dashboard
  clientSecret: "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe", // from the provider's dashboard
};

export const authConfig = {
  providers: [TickTickProvider],
  experimental: {
    enableWebAuthn: true,
  },
  // debug: true,
  // adapter: PrismaAdapter(db),
  callbacks: {
    authorized({ request, auth }) {
      console.log("pathname", request);
      return true;
    },
    async signIn({ profile }) {
      return true;
    },

    async jwt(token, user, account, profile, isNewUser) {
      console.log(token);
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(isNewUser);
      if (account.accessToken) {
        token.accessToken = account.accessToken;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      console.log("seesion", session, token);
      return session;
    },
  },
  basePath: "/api/auth",
} satisfies NextAuthConfig;
