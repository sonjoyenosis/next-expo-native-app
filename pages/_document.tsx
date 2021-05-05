import NextDocument, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends NextDocument {
  static async getInitialProps(ctx: any) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// @generated: @expo/next-adapter@2.1.69
// export { default } from "@expo/next-adapter/document";
