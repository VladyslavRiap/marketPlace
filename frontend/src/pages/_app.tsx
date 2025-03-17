import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import Layout from "@/components/Layout";
import { ModalProvider } from "@/context/ModalContext";
import AppInitializer from "@/components/AppInitializer";
import { SnackbarProvider } from "notistack";
import { SnackbarProviderWithContext } from "@/context/SnackBarContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <SnackbarProviderWithContext>
          <ModalProvider>
            <AppInitializer>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AppInitializer>
          </ModalProvider>
        </SnackbarProviderWithContext>
      </SnackbarProvider>
    </Provider>
  );
}

export default MyApp;
