import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modaleUp from "../reducers/modaleUp";
import modaleIn from "../reducers/modaleIn";
import allTweets from "../reducers/alltweets";
import user from "../reducers/user";
import allTrends from "../reducers/alltrends";

const store = configureStore({
  reducer: { modaleUp, modaleIn, allTweets, user, allTrends },
});

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Hackatweet</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
