import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import Layout from "@/components/Layout";

import AppInitializer from "@/components/AppInitializer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppInitializer>
    </Provider>
  );
}

export default MyApp;
