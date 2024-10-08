import React, { useState, useEffect } from "react";
import FooterLink from "./FooterLink.component";
import SocialIcon from "./SocialIcon.component";

const Footer = () => {
  const [merchLink, setMerchLink] = useState("");

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isEuropeOrUK = /^(Europe|GB)\//.test(userTimeZone);
    setMerchLink(
      isEuropeOrUK
        ? "https://stores.allotment.pro/frost-children/"
        : "https://frost-children.myshopify.com/"
    );
  }, []);

  const links = [
    {
      link: "/tour",
      key: "Tour",
      displayTitle: "TOUR",
    },
    {
      link: merchLink,
      key: "Merch",
      displayTitle: "MERCH",
    },
    {
      link: "https://songwhip.com/frostchildren",
      key: "Music",
      displayTitle: "MUSIC",
    },
    {
      link: "https://digital.umusic.com/frostchildren-signup",
      key: "Newsletter",
      displayTitle: "nEwsleTTer",
    },
    {
      link: "https://discord.gg/qZn6BqJXej",
      key: "Discord",
      displayTitle: "DISCORD",
    },
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
  ];

  return (
    <section id="footer-section" className="text-white">
      <div className="flex flex-col justify-center sm:grid sm:grid-cols-2 sm:mt-28 sm:mb-4 md:mt-4">
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
