import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Head, Html } from "next/document";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Html lang="en">
      <Component {...pageProps} />

    </Html>
  );
}

export default MyApp;
