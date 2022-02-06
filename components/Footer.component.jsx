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
    <section id="footer-section" className="text-white">
      <div className="flex flex-col justify-center">
        {links.map((link) => (
          <a href={link.link} target="_blank" rel="noopener noreferrer" key={link.title}>
            <div className="py-4 text-5xl text-center hover:text-6xl hover:text-fc-green">
              {/* <SocialIcon icon={link.title} /> */}

              <p className="font-bold">{link.displayTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Footer;
