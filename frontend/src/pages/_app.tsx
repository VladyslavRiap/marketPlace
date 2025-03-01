import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import Layout from "@/components/Layout";

import AppInitializer from "@/components/AppInitializer";
import { SnackbarProvider } from "notistack";
import { SnackbarProviderWithContext } from "@/context/SnackBarContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppInitializer>
        <SnackbarProvider maxSnack={3}>
          <SnackbarProviderWithContext>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProviderWithContext>
        </SnackbarProvider>
      </AppInitializer>
    </Provider>
  );
}

export default MyApp;
