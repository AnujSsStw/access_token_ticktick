import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import "~/styles/globals.css";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={GeistSans.className}>
      <SessionProvider session={session}>
        {" "}
        <Component {...pageProps} />{" "}
      </SessionProvider>
    </div>
  );
};

export default MyApp;
