// pages/api/login/github/index.ts
import { oauth2Client } from "../../../../auth";
import { generateCodeVerifier, generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }
  const state = generateState();
  const codeVerifier = generateCodeVerifier(); // for PKCE flow

  const url = await oauth2Client.createAuthorizationURL({
    state,
    scopes: ["tasks:write", "tasks:read"],
    codeVerifier,
  });

  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("github_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      }),
    )
    .redirect(url.toString());
}
