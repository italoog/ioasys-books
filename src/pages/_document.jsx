import Document, {
  Html,
  Head,
  Main,
  NextScript
} from 'next/document'
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="pt">
        <Head>
          <meta charSet="utf-8" />
          <meta name="ioasys Books" content="ioasys Books" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500&display=swap"
            rel="stylesheet"
          />

          <link
            rel="icon"
            href="https://media-exp1.licdn.com/dms/image/C4D0BAQEXbLGV0T-uFA/company-logo_200_200/0/1530557242980?e=1639612800&v=beta&t=KsOzWI4IXMA1wLX0LgQtdX45FzrM4uFvqUGrvT2CWfM"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
