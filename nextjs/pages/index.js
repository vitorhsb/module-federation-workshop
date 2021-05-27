import React, { Fragment } from "react";
import Head from "next/head";
//import ChatApp from "../components/ChatApp";
import SessionsApp from "../components/SessionsApp";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello</h1>
      <SessionsApp />
    </div>
  );
};

Home.getInitialProps = async (ctx) => {
  return {};
};

export default Home;
