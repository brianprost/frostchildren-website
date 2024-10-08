import React from "react";

const FooterLink = ({ link, displayTitle, onClick }) => {
  const [hoverColor, setHoverColor] = React.useState("white");

  const albumCoverColors = ["#b9d4ff", "#a25b6c", "#175B28"];

  //   achived...no thanks to Tailwind
  const toggleLinkColor = (isHover) => {
    isHover
      ? setHoverColor(albumCoverColors[Math.floor(Math.random() * (3 - 0) + 0)])
      : setHoverColor("white");
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={link}
      className="py-4 text-8xl text-center"
      onMouseEnter={() => toggleLinkColor(true)}
      onMouseLeave={() => toggleLinkColor(false)}
      onClick={handleClick}
    >
      <p className="font-aero font-bold transition duration-500 ease-in-out">
        {displayTitle}
      </p>
    </a>
  );
};

export default FooterLink;
