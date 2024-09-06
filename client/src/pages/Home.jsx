import React from "react";
import LatestNews from "../components/core/Home/LatestNews";
import CategoryWise from "../components/core/Home/CategoryWise";
import PolllAns from "./PollAns";
import ButtomAdd from "../components/core/Home/ButtomAdd";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <div className=" max-w-7xl p-4 mx-auto">
      <Helmet>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Discovery India News ," />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

        <meta property="og:title" content="Discovery India News" />
        <meta
          property="og:description"
          content="Stay updated with the latest news from Discovery India."
        />
        <meta
          property="og:image"
          content="https://www.discoveryindianews.com/apple-touch-icon.png"
        />
        <meta
          property="og:url"
          content="https://www.discoveryindianews.com/apple-touch-icon.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Discovery India News" />
        <meta
          name="twitter:description"
          content="Stay updated with the latest news from Discovery India."
        />
        <meta
          name="twitter:image"
          content="https://www.discoveryindianews.com/apple-touch-icon.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      </Helmet>
      <LatestNews />
      <CategoryWise />
      <ButtomAdd />
      <PolllAns />
    </div>
  );
}

export default Home;
