// pages/api/login/github/callback.ts
import { oauth2Client, lucia } from "../../../../auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }
  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState = req.cookies.github_oauth_state ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    res.status(400).end();
    return;
  }
  try {
    const clientId = "qSba4cM39GW0tCAKSj";
    const clientSecret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe";
    const credentials = btoa(`${clientId}:${clientSecret}`); // Encodes to base64
    const reses = await fetch("https://ticktick.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`, // Sets Basic Auth in the headers
        accept: "application/json",
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        scope: "tasks:write tasks:read", // Add the required scopes
        redirect_uri: "http://localhost:3000/api/login/github/callback",
      }),
    });

    const data = (await reses.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
    };
    console.log("data", data);
    console.log("Access Token:", reses); // Access token from the response

    // it's useless
    // const response = await fetch(
    //   "https://api.ticktick.com/api/v2/user/profile",
    //   {
    //     headers: {
    //       Authorization: `Bearer a318c416-4bbd-4459-8c68-7f38c8f29166`,
    //       contentType: "application/json",
    //       Cookie: reses.headers.get("set-cookie") || "",
    //     },
    //   },
    // );

    // here user can be just a access token
    const user = {
      externalId: "ani",
      username: "ani",
    };

    // Replace this with your own DB client.
    const existingUser = await db.user.findFirst({
      where: {
        github_id: user.externalId,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      return res
        .appendHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect("/");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.user.create({
      data: {
        id: userId,
        github_id: user.externalId || "ani",
        username: user.username || "ani",
      },
    });

    const session = await lucia.createSession(userId, {});
    return res
      .appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      )
      .redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    res.status(500).end();
    return;
  }
}

interface GitHubUser {
  id: string;
  login: string;
}
