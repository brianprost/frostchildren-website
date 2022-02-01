import Head from "next/head";
import { FrostLogo } from "../components/FrostLogo.component";

export default function Home() {
  return (
    <>
      <Head>
        <title>Frost Children</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-black touch-none overflow-clip">
        <div className="flex justify-center w-screen h-screen items-center">
          <FrostLogo />
        </div>
      </div>
    </>
  );
}
