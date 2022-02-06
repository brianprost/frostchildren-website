import React from "react";
import SocialIcon from "./SocialIcon.component";

const links = [
  {
    link: "https://www.instagram.com/thefrostchildren/",
    title: "Instagram",
    displayTitle: "INSTA",
  },
  {
    link: "https://www.youtube.com/channel/UCIfMtvBbD-D34HEtC2ezeJw",
    title: "YouTube",
    displayTitle: "VIDS",
  },
  {
    link: "https://frostchildren.bigcartel.com/",
    title: "Merch",
    displayTitle: "MERCH",
  },
  {
    link: "https://songwhip.com/frostchildren",
    title: "Music",
    displayTitle: "MUSIC",
  },
];

const Footer = () => {
  return (
    <section id="footer-section" className="bg-neutral-600 text-white">
      <div className="grid grid-cols-2 h-full">
        {links.map((link) => (
          <div
            key={link.title}
            className="box-border border border-neutral-500 flex flex-col justify-evenly items-center py-20 text-4xl"
          >
            <SocialIcon icon={link.title} />
            <a href={link.link} target="_blank" rel="noopener noreferrer">
              <p className=" font-sans font-bold">{link.displayTitle}</p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Footer;
