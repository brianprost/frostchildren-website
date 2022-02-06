import Head from "next/head";
import Footer from "../components/Footer.component";
import { FrostLogo } from "../components/FrostLogo.component";

export default function Home() {
  return (
    <>
      <Head>
        <title>Frost Children</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-black touch-none overflow-clip">
        <div className="grid grid-cols-1 grid-rows-2 w-screen h-screen items-center">
          <div className="row-span-1 w-full h-full flex justify-center items-center">
            <FrostLogo />
          </div>
          <div className="row-span-1 w-screen">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
