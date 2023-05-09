import Head from "next/head";
import Footer from "../components/Footer.component";
import { FrostLogo } from "../components/FrostLogo.component";
import Tour from "./tour";
import { NewsletterModal } from "../components/NewsletterModal";

export default function Home() {
  return (
    <div className="bg-black overflow-hidden ">
      <Head>
        <title>Frost Children</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className="relative w-full max-w-lg xl:min-h-screen">
        <div className="grid grid-rows-7 w-screen items-center">
          <div className="row-span-2 w-full h-full md:container md:w-1/2 md:mx-auto flex justify-center items-center">
            <FrostLogo />
          </div>
          <div className="row-span-5 w-screen">
            <Footer />
          </div>
        </div>
      </div>
      <div className="my-32">
        <Tour showLogo={false} />
      </div>
      <NewsletterModal />
    </div>
  );
}
