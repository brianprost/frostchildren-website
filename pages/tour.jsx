import Script from "next/script";
import React from "react";
import { FrostLogo } from "../components/FrostLogo.component";
import SeatedScript from "../components/Tour/SeatedScript.component";

export default function Tour({ showLogo }) {
  return (
    <section id="tour" className="bg-black mt-auto">
      {showLogo && (
        <div className="row-span-1 w-full h-full lg:container lg:w-1/2 lg:mx-auto flex justify-center items-center">
          <FrostLogo />
        </div>
      )}
      <div className="container w-auto max-w-lg mx-auto">
        <SeatedScript />
      </div>
    </section>
  );
}

Tour.defaultProps = {
  showLogo: true,
};
