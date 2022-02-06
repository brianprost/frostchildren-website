import Head from "next/head";
import Footer from "../components/Footer.component";
import { FrostLogo } from "../components/FrostLogo.component";

export default function Home() {
  return (
    <div className="bg-black bg-opacity-80 overflow-hidden">
      <Head>
        <title>Frost Children</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="relative w-full max-w-lg min-h-screen">
        <div className="absolute top-24 -left-4 w-72 h-72  bg-sky-600 rounded-full mix-blend-multiply filter blur-xl opacity-100 animate-blob"></div>
        <div className="absolute top-24 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-100 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72  bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-100 animate-blob animation-delay-4000"></div>
        <div className="relative">
          <div className="grid grid-cols-1 grid-rows-2 w-screen h-screen items-center">
            <div className="row-span-1 w-full h-full lg:container lg:w-1/2 lg:mx-auto flex justify-center items-center">
              <FrostLogo />
            </div>
            <div className="row-span-1 w-screen">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
