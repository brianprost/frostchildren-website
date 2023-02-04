import React, { useState } from "react";

const FooterLink = ({ link, displayTitle }) => {
  const [hoverColor, setHoverColor] = useState("white");

  const albumCoverColors = ["#b9d4ff", "#a25b6c", "#175B28"];

  //   achived...no thanks to Tailwind
  const toggleLinkColor = (isHover) => {
    isHover
      ? setHoverColor(albumCoverColors[Math.floor(Math.random() * (3 - 0) + 0)])
      : setHoverColor("white");
  };

  return (
    <a
      href={link}
      target={link.includes("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="py-4 text-8xl text-center"
      onMouseEnter={() => toggleLinkColor(true)}
      onMouseLeave={() => toggleLinkColor(false)}
    >
      {/* <SocialIcon icon={link.title} /> */}
      <p
        className="font-aero font-bold transition duration-500 ease-in-out"
        style={{ color: `${hoverColor}` }}
      >
        {displayTitle}
      </p>
    </a>
  );
};

export default FooterLink;
