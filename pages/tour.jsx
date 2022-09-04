import Script from "next/script";
import React from "react";
import { FrostLogo } from "../components/FrostLogo.component";

export default function Tour ({ showLogo }) {  
  return (
    <section id="tour" className="bg-black mt-auto">
      {showLogo && (
        <div className="row-span-1 w-full h-full lg:container lg:w-1/2 lg:mx-auto flex justify-center items-center">
          <FrostLogo logoSize="w-1/2 h-1/2" />
        </div>
      )}
      <div className="container w-auto max-w-lg mx-auto">
        <div
          id="seated-55fdf2c0"
          data-artist-id="0dd41d4d-c9b0-41a5-b3a1-49f5d9d810b1"
          data-css-version="2"
          className="text-white"
        ></div>
        <Script src="https://widget.seated.com/app.js"></Script>
      </div>
    </section>
  );
};

Tour.defaultProps = {
  showLogo: true,
};
