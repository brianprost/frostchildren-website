import React from "react";
import FooterLink from "./FooterLink.component";
import SocialIcon from "./SocialIcon.component";

const links = [
  // sup tailwind. i want to use dynamic classnames for hover colors. AND YOU'RE MAKING ME WISH I USED STYLED COMPONENTS
  {
    link: "https://www.instagram.com/thefrostchildren/",
    key: "Instagram",
    displayTitle: "INSTA",
  },
  {
    link: "https://www.youtube.com/channel/UCIfMtvBbD-D34HEtC2ezeJw",
    key: "YouTube",
    displayTitle: "VIDS",
  },
  {
    link: "https://frostchildren.bigcartel.com/",
    key: "Merch",
    displayTitle: "MERCH",
  },
  {
    link: "https://songwhip.com/frostchildren",
    key: "Music",
    displayTitle: "MUSIC",
  },
];

const Footer = () => {
  return (
    <section id="footer-section" className="text-white">
      <div className="flex flex-col justify-center">
        {links.map((link, index) => (
          <FooterLink
            key={`FooterLinkTo${link.key}`}
            link={link.link}
            displayTitle={link.displayTitle}
          />
        ))}
      </div>
    </section>
  );
};

export default Footer;
