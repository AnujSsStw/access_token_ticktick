import { signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
// import { signIn, signOut } from "~/server/auth";
// import { signIn, signOut } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <button onClick={() => signOut()}>Sign out</button>;
      <button
        onClick={async () => {
          try {
            const result = await signIn("ticktick", { redirectTo: "/" });
            console.log(result);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Sign In
      </button>
      <button
        onClick={async () => {
          try {
            const result = await signIn("", { redirectTo: "/" });
            console.log(result);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Sign In by viea
      </button>
    </div>
  );
}
