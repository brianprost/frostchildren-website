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
    <a href={link} target={ link.includes('http') ? '_blank' : '_self' } rel="noopener noreferrer">
      <div
        className="py-4 text-5xl text-center hover:text-6xl"
        onMouseEnter={() => toggleLinkColor(true)}
        onMouseLeave={() => toggleLinkColor(false)}
      >
        {/* <SocialIcon icon={link.title} /> */}
        <p className="font-bold" style={{ color: `${hoverColor}` }}>
          {displayTitle}
        </p>
      </div>
    </a>
  );
};

export default FooterLink;
