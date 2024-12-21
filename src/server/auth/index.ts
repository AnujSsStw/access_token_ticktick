import NextAuth, { NextAuthConfig } from "next-auth";

import { authConfig } from "./config";
import { OAuth2Config, Provider } from "next-auth/providers";
export let tkCode: string | undefined;
let tkCallback: string | undefined;
const clientId = "qSba4cM39GW0tCAKSj";
const clientSecret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe";
export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  // if (req?.method === "GET") {
  //   const url = new URL(req?.url);
  //   if (url.pathname === "/api/auth/callback/ticktick") {
  //     tkCode = url.searchParams.get("code") as string;
  //     tkCallback = url.pathname;
  //     console.log("tkCode", tkCode);
  //     console.log("tkCallback", tkCallback);
  //   }
  // }
  return authConfig;
});
