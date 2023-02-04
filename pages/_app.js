import "../styles/globals.css";
import "@fontsource/rowdies";
import ReactGA from 'react-ga';

function MyApp({ Component, pageProps }) {
  ReactGA.initialize('G-L77HN1FM9H');
  return <Component {...pageProps} />;
}

export default MyApp;
