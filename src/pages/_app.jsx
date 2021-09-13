import GlobalStyle from "../styles/global";
import { AuthProvider } from "../Context/hooks/useAuth";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
