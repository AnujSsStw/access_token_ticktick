const clientId = "qSba4cM39GW0tCAKSj";
const clientSecret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe";
const code = "9BXTjM"; // Replace with the authorization code obtained
const redirectUri = "http://localhost:3000/api/auth/callback/ticktick"; // Replace with your configured redirect URI

// Basic Auth credentials
const credentials = btoa(`${clientId}:${clientSecret}`); // Encodes to base64

export const doit = (code: string) => {
  fetch("https://ticktick.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`, // Sets Basic Auth in the headers
    },
    body: new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      scope: "tasks:write tasks:read", // Add the required scopes
      redirect_uri: redirectUri,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async (data) => {
      console.log("Token Response:", data); // Token response from the server

      console.log("Access Token:", data.access_token); // Access token from the response
      const response = await fetch(
        "https://api.ticktick.com/api/v2/user/profile",
        {
          headers: {
            Authorization: `Bearer a318c416-4bbd-4459-8c68-7f38c8f29166`,
          },
        },
      );
      console.log("userinfo", response);
    })
    .catch((error) => {
      console.log("Error:", error);

      console.error("Error:", error);
    });
};

// access_token: 'a318c416-4bbd-4459-8c68-7f38c8f29166',
// inbox125940487
// 67657bf87d52e7148a652029

const response = await fetch("https://api.ticktick.com/open/v1/task", {
  method: "POST",
  headers: {
    Authorization: `Bearer a318c416-4bbd-4459-8c68-7f38c8f29166`,
    // contentType: "application/json",
    // Cookie: `AWSALB=RRtcRLiXHQ7FKRWDL9kbY9syT4omhnk4OILvAMiNMrZFocyyYm9rD6X3UmTN6XLqOMABbTq8niEmafdezouylUjy7b+x839P7JXkRkMbouvAAZTqb4w0dtSBWUd8/axvbueY4i72Lin4j0T3l4ECVL9wRT5ds9TPbj/5vOGkd+xqpGuueBho3+J+FBBE3Q==; AWSALBCORS=RRtcRLiXHQ7FKRWDL9kbY9syT4omhnk4OILvAMiNMrZFocyyYm9rD6X3UmTN6XLqOMABbTq8niEmafdezouylUjy7b+x839P7JXkRkMbouvAAZTqb4w0dtSBWUd8/axvbueY4i72Lin4j0T3l4ECVL9wRT5ds9TPbj/5vOGkd+xqpGuueBho3+J+FBBE3Q==; _csrf_token=eSkSM5qLSSt1RLcJhHpcYH_7J4SfMbKmIJyTAKOAUQI-1734536071; t=154BB8FE91446783E780F0FFE4503B705DB83B1D009F3F70179A3BBB58A7815085255DBFCCA3741602C7633706442D7154DC526E88861B2382535B890AFFE462F0F779CB3C6F75E566115B4B5FCE7CF39505A448E80AF4DDB4986E586D7F199082BEE463B1431075BC4DD36207DCA5A89505A448E80AF4DD2BA73AFA5EAF411FC411DE5185BCE1EB2C55058FCDC1F7EDDCB33E61767351B1F1407CC4F16CA1779A79743001257AE7; oai=EAEDEFEB018A42B578DF4769BC8799E86ADB5625BC67B837B3ED91586A175106F343FA1DD3AC1B631644EFC0B3F8C1153B0F919F0E693CA81ADB53A42FD1645E75F380E35E14066C25DCD5AF0A273899D6935D8F6E1BFBB8C00FC2FDB3C11587D3056E5F14F4827012ED0EFC84A78184A497EB467010BC4E841697E6DE3464CE944C7AF4063ABFBE42955DFE1216528BF364320529B47A4E487E282C6B6DCF6A; SESSION=NmRhOWFjYzQtNTU2OC00Y2U4LWI3NzItODgzNWZjOTVmODY0; tt_distid=help-67657de23e267ef06569ffda`,
    // Cookie: `AWSALB=y099v/FuEkec8jVEWyp5DyQNGhgKEHcODxcC4kv649IcxkyJOtTyNosBp7RJn7JQBBrYnWIZczbk3oXT7oiN6lwi21rxUTX2upklqgU9G2jeArkuAHWMn4tPIEEt; Expires=Fri, 27 Dec 2024 14:40:49 GMT; Path=/, AWSALBCORS=y099v/FuEkec8jVEWyp5DyQNGhgKEHcODxcC4kv649IcxkyJOtTyNosBp7RJn7JQBBrYnWIZczbk3oXT7oiN6lwi21rxUTX2upklqgU9G2jeArkuAHWMn4tPIEEt; Expires=Fri, 27 Dec 2024 14:40:49 GMT; Path=/; SameSite=None; Secure`,
  },
  body: JSON.stringify({
    title: "Task Title",
    projectId: "6226ff9877acee87727f6bca",
  }),
});
console.log(response);

console.log("userinfo", await response.json());
